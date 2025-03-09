import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const houseId = await getUserHouseId();
    if (!houseId) throw new Error('User does not have a house');

    const supabase = await supabaseServer();

    const { data: completedChores, error } = await supabase
      .from('chores_completed')
      .select(
        `
        *,
        responsible (
          id,
          profile_id,
          activity_id,
          profile: profiles (
            id,
            name,
            image_url
          )
        ),
        chore: responsible (
          chores (
            id,
            title,
            description,
            time,
            house_id
          )
        )
      `
      )
      .eq('chore.chores.house_id', houseId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch completed chores');
    }

    return NextResponse.json(
      {
        data: completedChores,
        message: 'Successfully fetched completed chores'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /schedule/completed:', error);
    return NextResponse.json({ data: null, message: (error as Error).message }, { status: 500 });
  }
}
