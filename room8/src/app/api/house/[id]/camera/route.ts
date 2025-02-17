import { TCameraBody } from '@/app/(main)/house-settings/types';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const param = await params;
    const id = param.id;

    const { cameraId }: TCameraBody = await req.json();

    if (!cameraId) {
      return NextResponse.json(
        {
          data: null,
          message: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    const { data: userData } = await (supabase.auth.getUser())
    const userID = userData.user?.id;

    if (userID === null) {
        return NextResponse.json(
            {
            data: null,
            message: 'User not authenticated'
            },
            { status: 401 }
        );
    }
    
    const  {data: userProfile, error: userProfileError} = await supabase.from('profiles').select('*').eq('id', userID!).single();
    if (userProfileError || !userProfile) {
        throw new Error('Error fetching user profile');
    }
    if (userProfile.house_id !== id) {
        return NextResponse.json(
            {
            data: null,
            message: 'User is not in this house'
            },
            { status: 403 }
        );
    }

    const { error } = await supabase.from('houses').update({ camera_id: cameraId }).eq('id', id);
    if (error) {
        console.log(error)
      throw new Error('Failed to update house camera');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Updated house camera successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /house/id:/camera', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
