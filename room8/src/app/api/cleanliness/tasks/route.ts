import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const searchParams = req.nextUrl.searchParams;
    const logId = searchParams.get('logId');
    const houseId = await getUserHouseId();

    if (!houseId) {
      throw new Error('User is not in a house');
    }

    const { data: houseData, error: houseError } = await supabase
      .from('houses')
      .select('camera_id')
      .eq('id', houseId)
      .single();
    if (houseError || !houseData) {
      console.log('house data error:', houseError);
      throw new Error('Error fetching house data');
    }

    if (houseData.camera_id === null) {
      return NextResponse.json(
        {
          data: [],
          message: 'House does not have a camera'
        },
        { status: 200 }
      );
    }

    let query = supabase
      .from('cleanliness_tasks')
      .select(
        `
        *,
        assigned_by:assigned_by_id(id, name, image_url),
        assigned_to:assigned_to_id(id, name, image_url),
        completed_by:completed_by_id(id, name, image_url),
        cleanliness_log:cl_log_id(*)
        `
      )
      .eq('cleanliness_log.camera_id', houseData.camera_id);

    // If logId is provided, filter by that specific log
    if (logId) {
      query = query.eq('cl_log_id', logId);
    }

    const { data: tasks, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.log('cleanliness tasks error:', error);
      throw new Error('Error fetching cleanliness tasks');
    }

    return NextResponse.json(
      {
        data: tasks,
        message: 'Successfully Fetched Tasks'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /cleanliness/tasks:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
