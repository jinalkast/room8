import { THouseBody } from '@/app/(main)/house-settings/types';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const { address, name }: THouseBody = await req.json();
    const supabase = await supabaseServer();

    if (!address || !name) {
      throw new Error('Invalid house data');
    }

    const {
      data: { user },
      error: auth_error
    } = await supabase.auth.getUser();

    if (auth_error || !user) {
      throw new Error('User not authenticated');
    }

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      throw new Error('Failed to fetch user');
    }

    if (!userData) {
      throw new Error('User not found');
    }

    if (userData.house_id) {
      throw new Error('User is already in a house');
    }

    const { data: houseData, error: houseError } = await supabase
      .from('houses')
      .insert([{ address, name, owner: user.id }])
      .select()
      .single();

    if (houseError) {
      throw new Error('Failed to create house');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ house_id: houseData.id })
      .eq('id', user.id);

    if (profileError) {
      throw new Error('Failed to add user to house');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Successfully created house'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /house:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
