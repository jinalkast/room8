import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: user_profile, error: profile_error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);

    if (profile_error || !user_profile || user_profile.length === 0) {
      throw new Error('User does not have a profile');
    }

    const house_id = user_profile[0].house_id;

    if (house_id === null) {
      throw new Error('User does not have a house');
    }

    const { data: responseData, error: roommates_error } = await supabase
      .from('profiles')
      .select('*')
      .eq('house_id', house_id);

    if (roommates_error || responseData === null) {
      throw new Error('Error getting roomates');
    }

    return NextResponse.json(
      {
        data: responseData,
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
