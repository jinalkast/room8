import { postBillPresetSchema, TBillPreset } from '@/app/(main)/bill-splitter/types';
import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<NextResponse<TApiResponse<Tables<'bill_presets'>[]>>> {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // check user exists and has a home
    if (userProfileError || userProfile === null) {
      console.log('userProfile:', userProfile);
      throw new Error('Error fetching user profile');
    } else if (userProfile.house_id === null) {
      throw new Error('User has no house');
    }

    const { data: billPresets, error: billPresetsError } = await supabase
      .from('bill_presets')
      .select('*')
      .eq('house_id', userProfile.house_id);
    if (billPresetsError) {
      console.log('billPresetsError:', billPresetsError);
      throw new Error('Error fetching bills');
    }

    return NextResponse.json(
      {
        data: billPresets,
        message: 'Successfully Fetched Bill presets'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /bills/presets:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<TApiResponse<Tables<'bill_presets'>>>> {
  try {
    const data: TBillPreset = await req.json();
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: validatedData, success, error: validationErrors } = postBillPresetSchema.safeParse({...data, owes: new Map(Object.entries(data.owes))});
    if (validationErrors) {
      console.log('validationErrors:', validationErrors);
      throw new Error('Invalid data');
    }

    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    // check user exists and has a home
    if (userProfileError || userProfile === null) {
      console.log('userProfile:', userProfile);
      throw new Error('Error fetching user profile');
    } else if (userProfile.house_id === null) {
      throw new Error('User has no house');
    }


    const { data: presetData, error: presetError } = await supabase
      .from('bill_presets')
      .insert([
        {
          house_id: userProfile.house_id,
          name: validatedData.name,
          amount: validatedData.amount,
          owed_by: undefined,
          owes: JSON.stringify(Object.fromEntries(validatedData.owes))
        }
      ])
      .select()
      .single();

    if (!presetData || presetError) {
      console.log('presetError:', presetError);
      throw new Error('Error creating bill preset');
    }

    return NextResponse.json(
      {
        data: null,//presetData,
        message: 'Successfully Created Bill'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /bills/preset:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
