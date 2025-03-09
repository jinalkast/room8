import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse, TOweDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(req: NextRequest): Promise<NextResponse<TApiResponse<TOweDB>>> {
  try {
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const owe_id = segments[segments.length - 1];

    const { paid } = await req.json();
    if (typeof paid !== 'boolean') {
      throw new Error('Invalid request body');
    }

    const supabase = await supabaseServer();
    const { data: oweData, error } = await supabase
      .from('owes')
      .update({ paid: paid })
      .eq('id', owe_id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        data: oweData,
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
