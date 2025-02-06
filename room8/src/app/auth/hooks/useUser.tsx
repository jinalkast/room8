'use client';

import { supabaseBrowser } from '@/lib/supabase/browser';
import { Tables } from '@/lib/types/supabase';
import { useQuery } from '@tanstack/react-query';

const initUser: Tables<'profiles'> = {
    created_at: '',
    email: '',
    house_id: '',
    id: '',
    image_url: '',
    name: '',
    phone: '',
    updated_at: '',
}

export default function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: user } = await supabase
          .from('profiles')
          .select()
          .eq('id', data.session.user.id)
          .single();

        return user;
      }

      return initUser;
    }
  });
}
