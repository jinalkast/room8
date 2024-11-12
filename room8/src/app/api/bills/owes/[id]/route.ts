import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    const { paid } = await req.json();
    if (typeof paid !== 'boolean') {
      throw new Error('Invalid request body');
    }

    const supabase = await supabaseServer();
    await supabase.from('owes').update({ paid: paid }).eq('id', id);

    return NextResponse.json(
      {
        data: {},
        message: 'Successfully Fetched Owes'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /bills/owes:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
