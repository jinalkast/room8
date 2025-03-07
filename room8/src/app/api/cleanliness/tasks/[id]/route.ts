import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const taskId = segments[segments.length - 1];

    const supabase = await supabaseServer();
    const { status, assigned_to_id, assigned_by_id, completed_by_id } = await req.json();
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

    if (status === 'canceled') {
      updateData.assigned_to_id = null;
      updateData.assigned_by_id = null;
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
    } else {
      throw new Error('Invalid status');
    }

    const { data: task, error } = await supabase
      .from('cleanliness_tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error('Error updating cleanliness task');
    }

    return NextResponse.json(
      {
        data: task,
        message: 'Successfully updated task'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /cleanliness/tasks/[id]:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
