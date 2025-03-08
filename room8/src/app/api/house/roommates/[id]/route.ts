import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];

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

    // get user house id
    const { data: userHouse, error: userHouseError } = await supabase
      .from('profiles')
      .select('house_id')
      .eq('id', id)
      .single();

    if (userHouseError) {
      throw new Error('Failed to fetch user house');
    }

    if (!userHouse || !userHouse.house_id) {
      throw new Error('User not found');
    }

    const { error } = await supabase.from('profiles').update({ house_id: null }).eq('id', id);

    if (error) {
      throw new Error('Failed to remove house roommate');
    }

    // check if there is no one else living in that house, if so, delete the house
    const { data: houseRoommates, error: houseRoommatesError } = await supabase
      .from('profiles')
      .select('house_id')
      .eq('house_id', userHouse.house_id);

    if (houseRoommatesError) {
      throw new Error('Failed to fetch house roommates');
    }

    if (houseRoommates.length === 0) {
      const { error: deleteHouseError } = await supabase
        .from('houses')
        .delete()
        .eq('id', userHouse.house_id);

      if (deleteHouseError) {
        throw new Error('Failed to delete house');
      }

      // delete all house invites from this house
      const { error: deleteHouseInvitesError } = await supabase
        .from('house_invites')
        .delete()
        .eq('house_id', userHouse.house_id);

      if (deleteHouseInvitesError) {
        throw new Error('Failed to delete house invites');
      }
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Removed roommate successfuly'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /house/roommates/id:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
