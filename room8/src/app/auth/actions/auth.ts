'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/');
}
