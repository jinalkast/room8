import { TInviteDB, TPendingInvite } from '@/app/(main)/house-settings/types';
import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<TApiResponse<TPendingInvite[]>>> {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile === null || profileError) {
      throw new Error('Failed to fetch user profile');
    } else if (profile.house_id === null) {
      throw new Error('User is not in a house');
    }

    const { data: invites, error: invitesError } = await supabase
      .from('house_invites')
      .select('*, invited_user:profiles!user_id(*)')
      .eq('house_id', profile.house_id);

    if (invitesError) {
      throw new Error('Failed to pending invites');
    }

    // The Supabase types are not correct. Ignore the type error
    // @ts-ignore
    return NextResponse.json(
      {
        data: invites,
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
