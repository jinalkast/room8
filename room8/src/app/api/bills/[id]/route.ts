import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.from('amounts_owed').select('*').eq('bill_id', id);
    if (error) {
      console.log(`Error fetching owes for bill ${id}:`, error);
      throw new Error(`Error fetching owes for bill ${id}`);
    }

    return NextResponse.json(
      {
        data: data,
        message: `Successfully Fetched Owes For Bill ${id}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in GET /bills/[${id}]:`, error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
