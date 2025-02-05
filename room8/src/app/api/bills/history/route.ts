import { supabaseServer } from '@/lib/supabase/server';
import { TAmountOwedDB, TApiResponse, TBillDB } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse<TApiResponse<TAmountOwedDB[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');

    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: historyData, error: historyError } = await supabase
      .from('amounts_owed')
      .select('*')
      .or(`debtor_id.eq.${user.id},loaner_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });
      // .range((page - 1) * 10, page * 10);
    if (historyError) {
      console.log('historyError:', historyError);
      throw new Error('Error fetching history');
    }

    return NextResponse.json(
      {
        data: historyData,
        message: 'Successfully Fetched history'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET bills/history:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
