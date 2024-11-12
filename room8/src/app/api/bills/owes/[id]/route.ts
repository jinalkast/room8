import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const reqData = await req.json();
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // supabase.from('owe').upsert();

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
