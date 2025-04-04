import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest): Promise<NextResponse<TApiResponse<Tables<'house_invites'>>>> {
  try {
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const inviteID = segments[segments.length - 1];

    const supabase = await supabaseServer();

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: deletedInvite, error: deletedInviteError } = await supabase
      .from('house_invites')
      .delete()
      .eq('id', inviteID)
      .select()
      .single();

    if (deletedInviteError) {
      throw new Error('Failed to delete invite');
    }

    return NextResponse.json(
      {
        data: deletedInvite,
        message: 'Successfully fetched pending invites'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /house/invite/pending:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { userEmail, inviterId, houseId } = await req.json();
//     const supabase = await supabaseServer();

//     if (!userEmail || !inviterId || !houseId) {
//       throw new Error('Missing required fields');
//     }

//     const { data: userData, error: userError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', userEmail)
//       .single();

//     if (userError) {
//       throw new Error('Failed to fetch user');
//     }

//     if (!userData) {
//       throw new Error('User not found');
//     }

//     // Check if the user is already in a house
//     if (userData.house_id === houseId) {
//       throw new Error('User is already in the house');
//     }

//     // Check if the user has already been invited by this user
//     const { data: existingInvite, error: existingInviteError } = await supabase
//       .from('house_invites')
//       .select()
//       .eq('user_id', userData.id)
//       .eq('inviter_id', inviterId)
//       .eq('house_id', houseId);

//     console.log(existingInvite, existingInviteError);

//     if (existingInviteError) {
//       throw new Error('Failed to check for existing invite');
//     }

//     if (existingInvite.length > 0) {
//       throw new Error('User has already been invited by this user');
//     }

//     const { data: invite, error: inviteError } = await supabase
//       .from('house_invites')
//       .insert({ house_id: houseId, user_id: userData.id, inviter_id: inviterId })
//       .select();

//     return NextResponse.json(
//       {
//         data: null,
//         message: 'Successfully sent invite'
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error in POST /house/invite:', error);
//     return NextResponse.json(
//       {
//         data: null,
//         message: (error as Error).message
//       },
//       { status: 500 }
//     );
//   }
// }
