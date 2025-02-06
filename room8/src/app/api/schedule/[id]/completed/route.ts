import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ data: null, message: 'Missing chore ID' }, { status: 400 });
    }

    const supabase = await supabaseServer();

    // Step 1: Get all responsible entries for this chore
    const { data: responsibleEntries, error: responsibleError } = await supabase
      .from('responsible')
      .select('id, profile_id')
      .eq('activity_id', id);

    if (responsibleError) {
      throw new Error('Failed to fetch responsible entries');
    }

    // Extract responsible IDs
    const responsibleIds = responsibleEntries.map((entry) => entry.id);

    if (responsibleIds.length === 0) {
      return NextResponse.json(
        { data: [], message: 'No responsible users found for this chore' },
        { status: 200 }
      );
    }

    // Step 2: Get completed chores where responsible_id matches
    const { data: completedChores, error: completedError } = await supabase
      .from('chores_completed')
      .select('id, created_at, responsible_id') // Select only necessary fields
      .in('responsible_id', responsibleIds);

    if (completedError) {
      throw new Error('Failed to fetch completed chores');
    }

    // Map responsible_id to profile_id
    const enrichedChores = completedChores.map((chore) => ({
      ...chore,
      profile_id:
        responsibleEntries.find((entry) => entry.id === chore.responsible_id)?.profile_id || null
    }));

    return NextResponse.json(
      {
        data: enrichedChores,
        message: 'Fetched completed chores successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /schedule/:id/completed:', error);
    return NextResponse.json({ data: null, message: (error as Error).message }, { status: 500 });
  }
}
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ data: null, message: 'Unauthorized' }, { status: 401 });
    }

    // Get responsible entry for this user and chore
    const { isCompleted, userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ data: null, message: 'Missing userId' }, { status: 400 });
    }

    const { data: responsible, error: responsibleError } = await supabase
      .from('responsible')
      .select('id')
      .eq('activity_id', id)
      .eq('profile_id', userId)
      .single();

    if (responsibleError || !responsible) {
      return NextResponse.json(
        { data: null, message: 'Not responsible for this chore' },
        { status: 403 }
      );
    }

    if (isCompleted) {
      const { data, error } = await supabase
        .from('chores_completed')
        .insert({ responsible_id: responsible.id });

      if (error) {
        throw new Error('Failed to mark chore as completed');
      }

      return NextResponse.json({ data, message: 'Chore marked as completed' }, { status: 200 });
    } else {
      const { error } = await supabase
        .from('chores_completed')
        .delete()
        .eq('responsible_id', responsible.id);

      if (error) {
        throw new Error('Failed to delete completed chore entry');
      }

      return NextResponse.json({ message: 'Completed chore entry deleted' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in POST /schedule/:id/completed:', error);
    return NextResponse.json({ data: null, message: (error as Error).message }, { status: 500 });
  }
}
