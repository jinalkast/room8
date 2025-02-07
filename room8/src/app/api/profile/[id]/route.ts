import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { updateProfilePayload } from "@/app/(main)/profile/types";
import { TApiResponse, TRoommateDB } from "@/lib/types";

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'imae/jpg'];

function getMimeType(base64String: string) {
    const match = base64String.match(/^data:([a-zA-Z0-9/+.-]+);base64,/);
    return match ? match[1].toLowerCase() : null;
  }

function removeBase64Prefix(base64String: string) {
    return base64String.replace(/^data:image\/\w+;base64,/, "");
  }

function b64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<TApiResponse<TRoommateDB>>> {
    try {
        const { id } = await params;
        const supabase = await supabaseServer();

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                data: null,
                message: 'User not authenticated'
            }, { status: 401 });
        }

        if (user.id !== id) {
            return NextResponse.json({
                data: null,
                message: 'You may not update another user\'s profile'
            }, { status: 403 });
        }

        const body: updateProfilePayload = await req.json();
        let image_url: string | undefined;

        // Upload to supabase & get URL
        if (body.profilePicture) {
            const mimeType = getMimeType(body.profilePicture);
            if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
                if (!user) {
                    return NextResponse.json({
                        data: null,
                        message: 'Image has inappropriate MIME Type'
                    }, { status: 400 });
                }
            }
            const base64Data = removeBase64Prefix(body.profilePicture);
            const blob = b64ToBlob(base64Data, mimeType!)

            const imageExtension = mimeType!.split('/')[1];
            const filePath = `${id}.${imageExtension}`;



            const { data: img_data, error: img_error } = await supabase.storage.from('custom_profile_pictures').update(filePath, blob, { upsert: true, contentType: `image/${imageExtension}` });
            if (img_error) {
                throw img_error;
            }

            image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/custom_profile_pictures/${filePath}`;
        }

        // Update row
        const { data, error } = await supabase.from('profiles').update({
            'phone': body.phoneNumber,
            'name': body.name,
            'image_url': image_url
        }).eq('id', id).select().single();

        if (error) {
            throw error
        }

        return NextResponse.json(
            {
                data: data,
                message: 'Profile updated successfully'
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                data: null,
                message: (error as Error).message
            },
            { status: 500 }
        );
    }

}
