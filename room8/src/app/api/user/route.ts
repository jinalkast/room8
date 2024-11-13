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
    return NextResponse.json(
      {
        data: user_profile,
        message: 'Successfully retrieved user profile'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /user:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}