import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<NextResponse<TApiResponse<Tables<'cleanliness_logs'>[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const houseID = searchParams.get('houseID')
    if (!houseID) {
      return NextResponse.json({
        data: null,
        message: "Bad Request: houseID is required"
      },
      { status: 400 });
    }

    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: cleanlinessLogs, error } = await supabase.from('cleanliness_logs').select('*').eq('house_id', houseID).order('created_at', { ascending: false });
    console.log(cleanlinessLogs)
    if (error) {
      console.log('cleanliness logs error:', error);
      throw new Error('Error fetching cleanliness logs');
    }

    return NextResponse.json(
      {
        data: cleanlinessLogs,
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
