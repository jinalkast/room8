import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

  const { error } = await supabase.from('profiles').update({ house_id: null }).eq('id', id);

  if (error) {
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to remove roommate'
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: null,
      message: 'Removed roommate successfuly'
    },
    { status: 200 }
  );
}
