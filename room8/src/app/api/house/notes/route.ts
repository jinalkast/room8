import { TNoteBody } from '@/app/(main)/house-settings/types';
import { getUserHouseId } from '@/lib/services';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const houseId = await getUserHouseId();

    if (!houseId) throw new Error('User does not have a house');

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('house_id', houseId)
      .order('favourited', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to retrieve notes');

    return NextResponse.json(
      {
        data,
        message: 'Successfully retrieved notes'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /notes:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, favourited = false }: TNoteBody = await req.json();
    const houseId = await getUserHouseId();

    if (!text || !houseId) {
      return NextResponse.json(
        {
          data: null,
          message: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([{ text, poster_id: user.id, house_id: houseId, favourited }])
      .select();

    if (error) {
      return NextResponse.json(
        {
          data: null,
          message: 'Failed to create note'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data,
        message: 'Successfully created note'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /notes:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
