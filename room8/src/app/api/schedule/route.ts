import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  // Create chore from title, description, and list of uuids

  const { title, date, description, responsible } = await req.json();

  if (!title || !description || !responsible || !date) {
    return NextResponse.json(
      {
        data: null,
        message: 'Missing required fields'
      },
      { status: 400 }
    );
  }

  const houseId = await getUserHouseId();

  if (!houseId) {
    return NextResponse.json(
      {
        data: null,
        message: 'User does not have a house'
      },
      { status: 400 }
    );
  }

  const supabase = await supabaseServer();

  console.log(title, date, description, responsible, houseId);

  const { data, error } = await supabase
    .from('activities')
    .insert([
      {
        title,
        description,
        time: date.toLowerCase(),
        house_id: houseId
      }
    ])
    .select();

  console.log(error);

  if (error) {
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to create activity'
      },
      { status: 500 }
    );
  }

  responsible.forEach(async (profile_id: string) => {
    const { error: responsible_error } = await supabase.from('responsible').insert([
      {
        activity_id: data[0].id,
        profile_id
      }
    ]);

    if (responsible_error) {
      return NextResponse.json(
        {
          data: null,
          message: 'Failed to create responsible'
        },
        { status: 500 }
      );
    }
  });

  return NextResponse.json(
    {
      data: data,
      message: 'Successfully created activity'
    },
    { status: 200 }
  );
}
