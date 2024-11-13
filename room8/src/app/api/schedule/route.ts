import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const houseId = await getUserHouseId();

    if (!houseId) throw new Error('User does not have a house');

    const supabase = await supabaseServer();
    const { data, error } = await supabase.from('activities').select('*').eq('house_id', houseId);

    if (error) throw new Error('Failed to retrieve activities data');

    // add all responsible roommates to the activity object

    if (!data) throw new Error('No activities found');

    const newData = await Promise.all(
      data.map(async (activity) => {
        const { data: responsible, error: responsible_error } = await supabase
          .from('responsible')
          .select('profile_id')
          .eq('activity_id', activity.id);

        if (responsible_error) throw new Error('Failed to retrieve responsible data');

        return {
          ...activity,
          responsible: responsible.map((responsible) => responsible.profile_id)
        };
      })
    );

    return NextResponse.json(
      {
        data: newData,
        message: 'Successfully retrieved activities data'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /schedule:', error);
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to retrieve activities data'
      },
      { status: 500 }
    );
  }
}
