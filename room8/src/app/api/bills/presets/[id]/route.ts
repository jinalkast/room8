import { supabaseServer } from '@/lib/supabase/server';
import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  req: NextRequest
): Promise<NextResponse<TApiResponse<Tables<'bill_presets'>>>> {
  try {
    const { pathname } = req.nextUrl;
    console.log(pathname, 'pathname');
    const segments = pathname.split('/');
    const presetID = segments[segments.length - 1];

    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: presetData, error: presetError } = await supabase
      .from('bill_presets')
      .delete()
      .eq('id', presetID)
      .select('*')
      .single();

    if (!presetData || presetError) {
      console.log('presetError:', presetError);
      throw new Error('Error deleting bill preset');
    }

    return NextResponse.json(
      {
        data: null,//presetData,
        message: 'Successfully deleted bill preset'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /bills/presets/[id]:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
