import { THouseBody } from '@/app/(main)/house-settings/types';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const param = await params;
    const id = param.id;

    const { address, name }: THouseBody = await req.json();

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

    if (!address || !name) {
      throw new Error('Invalid house data');
    }

    const { error } = await supabase.from('houses').update({ address, name }).eq('id', id);

    if (error) {
      throw new Error('Failed to update house');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Updated house successfuly'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /house/id:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
