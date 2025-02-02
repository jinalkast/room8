import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page');

    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: billData, error: billError } = await supabase.rpc('get_bill_summary_for_user', {
      result_offset: page !== null ? (parseInt(page) - 1) * 10 : 0,
      user_id_param: user.id
    });

    if (billError) {
      console.log('billError:', billError);
      throw new Error('Error fetching bills');
    }

    return NextResponse.json(
      {
        data: billData,
        message: 'Successfully Fetched Bills'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /bills:', error);
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
    const data = await req.json();
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: billData, error: billError } = await supabase
      .from('bills')
      .insert({ name: data.name, total: data.amount, loaner_id: user.id })
      .select();

    if (billError) {
      console.log('billError:', billError);
      throw new Error('Error creating bill');
    }

    for (const [debtorId, debtValue] of Object.entries(data.owes)) {
      const { data: debtData, error: debtError } = await supabase
        .from('owes')
        .insert({ bill_id: billData[0].id, debtor_id: debtorId, amount: debtValue as number })
        .select();

      if (debtError) {
        await supabase.from('bills').delete().eq('id', billData![0].id); // Cascading deletes delete all owes for this bill
        throw new Error('Error creating debt');
      }
    }

    return NextResponse.json(
      {
        data: billData,
        message: 'Successfully Created Bill'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /bills:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
