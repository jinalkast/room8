import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<NextResponse<TApiResponse<Tables<'cleanliness_logs'>[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const houseID = searchParams.get('houseID');
    if (!houseID) {
      return NextResponse.json(
        {
          data: null,
          message: 'Bad Request: houseID is required'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: houseData, error: houseError } = await supabase.from('houses').select('camera_id').eq('id', houseID).single();
    if (houseError || !houseData) {
      console.log('house data error:', houseError);
      throw new Error('Error fetching house data');
    }

    if (houseData.camera_id === null) {
      return NextResponse.json(
        {
          data: [],
          message: 'House does not have a camera'
        },
        { status: 200 }
      );
    }

    const { data: cleanlinessLogs, error } = await supabase
      .from('cleanliness_logs')
      .select('*')
      .eq('camera_id', houseData.camera_id)
      .order('created_at', { ascending: false });

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
