import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  // delete chore from activities table based on id in url

  const { pathname } = req.nextUrl;
  const segments = pathname.split('/');
  const id = segments[segments.length - 1];

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

  const { error } = await supabase.from('chores').delete().eq('id', id);

  console.log(error);

  if (error) {
    return NextResponse.json(
      {
        data: null,
        message: 'Failed to delete activity'
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: null,
      message: 'Activity deleted successfully'
    },
    { status: 200 }
  );
}
