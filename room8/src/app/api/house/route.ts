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

    const { data: user_house, error: house_error } = await supabase
      .from('profiles')
      .select('houses!profiles_house_id_fkey(*)')
      .eq('id', user.id)
      .single();

    if (house_error || !user_house) {
      throw new Error('User does not have a house');
    }

    return NextResponse.json(
      {
        data: user_house.houses,
        message: "Successfully retrieved user's house"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /house:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
