import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: invites, error: invitesError } = await supabase
      .from('house_invites')
      .select('*, house:house_id(*), inviter:inviter_id(*)')
      .eq('user_id', user.id);

    if (invitesError) {
      throw new Error('Failed to fetch invites');
    }

    return NextResponse.json(
      {
        data: invites,
        message: 'Successfully fetched invites'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /house/invite:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userEmail, inviterId, houseId } = await req.json();
    const supabase = await supabaseServer();

    if (!userEmail || !inviterId || !houseId) {
      throw new Error('Missing required fields');
    }

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (userError) {
      throw new Error('Failed to fetch user');
    }

    if (!userData) {
      throw new Error('User not found');
    }

    // Check if the user is already in a house
    if (userData.house_id === houseId) {
      throw new Error('User is already in the house');
    }

    // Check if the user has already been invited by this user
    const { data: existingInvite, error: existingInviteError } = await supabase
      .from('house_invites')
      .select()
      .eq('user_id', userData.id)
      .eq('inviter_id', inviterId)
      .eq('house_id', houseId)
      .single();

    if (existingInviteError) {
      throw new Error('Failed to check for existing invite');
    }

    if (existingInvite) {
      throw new Error('User has already been invited by this user');
    }

    const { data: invite, error: inviteError } = await supabase
      .from('house_invites')
      .insert({ house_id: houseId, user_id: userData.id, inviter_id: inviterId })
      .select();

    console.log('invite:', invite);

    return NextResponse.json(
      {
        data: null,
        message: 'Successfully sent invite'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /house/invite:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
