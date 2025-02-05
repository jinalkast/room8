import { TNoteBody } from '@/app/(main)/house-settings/types';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // fail if note poster id does not match user id
    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: note, error: note_error } = await supabase
      .from('notes')
      .select('poster_id')
      .eq('id', id)
      .single();

    if (note_error || !note) {
      throw new Error('Failed to retrieve note');
    }

    if (note.poster_id !== user.id) {
      throw new Error('User does not have permission to delete note');
    }

    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) {
      throw new Error('Failed to delete note');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Deleted note successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /notes/id:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const { favourited }: TNoteBody = await req.json();

    if (typeof favourited !== 'boolean') {
      return NextResponse.json(
        {
          data: null,
          message: 'Invalid favourite value'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    console.log('Favourited: ', favourited);

    const { error } = await supabase.from('notes').update({ favourited }).eq('id', id);

    if (error) {
      throw new Error('Failed to update note');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Updated note successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /notes/id:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
