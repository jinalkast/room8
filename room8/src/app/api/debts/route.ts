import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: debts, error: debtsError } = await supabase
      .from('amounts_owed')
      .select()
      .eq('debtor_id', user.id);

    if (debtsError) {
      console.log('billError:', debtsError);
      throw new Error('Error fetching debts');
    }

    return NextResponse.json(
      {
        data: debts,
        message: 'Successfully Fetched Debts'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /debts:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
