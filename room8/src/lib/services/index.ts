import { supabaseServer } from '../supabase/server';

export const getUserHouseId = async () => {
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

  return user_profile[0].house_id;
};
