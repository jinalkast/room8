import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse, TOweDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { 
  params: { 
    id: string, owe_id: string 
  } 
}): Promise<NextResponse<TApiResponse<TOweDB>>> {
  try {
    const { id: bill_id, owe_id } = await params;

    const { paid } = await req.json();
    if (typeof paid !== 'boolean') {
      throw new Error('Invalid request body');
    }

    const supabase = await supabaseServer();
    console.log('bill_id:', bill_id, 'owe_id:', owe_id, 'paid:', paid);
    const { data: oweData, error } = await supabase.from('owes').update({ paid: paid }).eq('id', owe_id).select().single();
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
