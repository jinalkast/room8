import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const param = await params;
    const id = param.id;

    if (!id) {
      return NextResponse.json(
        {
          data: null,
          message: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const { error: deleteInviteError } = await supabase.from('house_invites').delete().eq('id', id);

    if (deleteInviteError) {
      throw new Error('Failed to delete invite');
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Successfully deleted invite'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /house/invite/decline:', error);
    return NextResponse.json(
      {
        data: null,
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
