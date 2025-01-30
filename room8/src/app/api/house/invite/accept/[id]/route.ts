import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const param = await params;
    const id = param.id;

    if (!id) {
      return NextResponse.json(
        {
          data: null,
          message: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const { data: invite, error: inviteError } = await supabase
      .from('house_invites')
      .select()
      .eq('id', id)
      .single();

    if (!invite) {
      throw new Error('Invite not found');
    }

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ house_id: invite.house_id })
      .eq('id', invite.user_id);

    if (updateProfileError) {
      throw new Error('Failed to update profile');
    }

    const { error: deleteInviteError } = await supabase.from('house_invites').delete().eq('id', id);

    if (deleteInviteError) {
      throw new Error('Failed to delete invite');
    }

    // delete all invites to this house for this user
    const { error: deleteAllInvitesError } = await supabase
      .from('house_invites')
      .delete()
      .eq('user_id', invite.user_id)
      .eq('house_id', invite.house_id);

    if (deleteAllInvitesError) {
      throw new Error('Failed to delete all invites');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Successfully accepted invite'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /house/invite/accept:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
