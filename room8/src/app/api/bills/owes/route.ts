import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
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

    const { data: owes, error: owesError } = await supabase
      .from('amounts_owed')
      .select('*')
      .eq('debtor_id', user.id)
      .eq('paid', false);
    // .range((page - 1) * 10, page * 10);

    if (owesError) {
      console.log('billError:', owesError);
      throw new Error('Error fetching owes');
    }

    return NextResponse.json(
      {
        data: owes,
        message: 'Successfully Fetched owes'
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
