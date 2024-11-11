import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    console.log(data);

    return NextResponse.json(
      {
        data: { gang: 'gang' },
        message: 'Successfully retrieved list of roomates'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /habits:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
