import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
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
export async function PUT(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { ids, status, assigned_to_id, assigned_by_id, completed_by_id } = await req.json();
    const houseId = await getUserHouseId();

    if (!houseId) {
      throw new Error('User is not in a house');
    }

    let updateData: {
      status: string;
      assigned_to_id?: string | null;
      assigned_by_id?: string | null;
      completed_by_id?: string | null;
    } = {
      status: status,
      completed_by_id: null
    };

    if (status === 'dismissed') {
      updateData.assigned_to_id = null;
      updateData.assigned_by_id = null;
      updateData.completed_by_id = null;
    } else if (status === 'completed') {
      updateData.status = 'completed';
      if (!completed_by_id) {
        throw new Error('Completed by ID is required for completed status');
      }
      updateData.completed_by_id = completed_by_id;
    } else if (status === 'pending') {
      if (!assigned_to_id || !assigned_by_id) {
        throw new Error('Assigned to and assigned by are required for pending status');
      }
      updateData.assigned_to_id = assigned_to_id;
      updateData.assigned_by_id = assigned_by_id;
    } else if (status === 'unassigned') {
      updateData.assigned_to_id = null;
      updateData.assigned_by_id = null;
      updateData.completed_by_id = null;
    } else {
      throw new Error('Invalid status');
    }

    const { data: tasks, error } = await supabase
      .from('cleanliness_tasks')
      .update(updateData)
      .in('id', ids)
      .select();

    if (error) {
      console.error('Error updating tasks:', error);
      throw new Error('Error updating cleanliness tasks');
    }

    return NextResponse.json(
      {
        data: tasks,
        message: 'Successfully updated tasks'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /cleanliness/tasks:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { ids } = await req.json();
    const houseId = await getUserHouseId();

    if (!houseId) {
      throw new Error('User is not in a house');
    }

    const { error } = await supabase.from('cleanliness_tasks').delete().in('id', ids);

    if (error) {
      console.error('Error deleting tasks:', error);
      throw new Error('Error deleting cleanliness tasks');
    }

    return NextResponse.json(
      {
        message: 'Successfully deleted tasks'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /cleanliness/tasks:', error);
    return NextResponse.json(
      {
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
