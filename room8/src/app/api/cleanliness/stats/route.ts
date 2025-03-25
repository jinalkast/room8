import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest): Promise<NextResponse<TApiResponse<any>>> {
  try {
    const houseId = await getUserHouseId();

    if (!houseId) {
      throw new Error('User is not in a house');
    }

    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: roommates, error: roommatesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('house_id', houseId);

    if (roommatesError || !roommates) {
      console.log('roommates error:', roommatesError);
      throw new Error('Error fetching roommates');
    }

    const { data: cleanlinessTasks, error: tasksError } = await supabase
      .from('cleanliness_tasks')
      .select('*');

    if (tasksError || !cleanlinessTasks) {
      console.log('cleanliness tasks error:', tasksError);
      throw new Error('Error fetching cleanliness tasks');
    }

    const stats = roommates.map((roommate) => {
      const assignedToTasks = cleanlinessTasks.filter(
        (task) => task.assigned_to_id === roommate.id
      ).length;

      const completedByTasks = cleanlinessTasks.filter(
        (task) => task.completed_by_id === roommate.id
      ).length;

      const assignedByTasks = cleanlinessTasks.filter(
        (task) => task.assigned_by_id === roommate.id
      ).length;

      return {
        ...roommate,
        assignedToTasks,
        completedByTasks,
        assignedByTasks
      };
    });

    return NextResponse.json(
      {
        data: stats,
        message: 'Successfully fetched cleanliness stats'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /cleanliness/stats:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
