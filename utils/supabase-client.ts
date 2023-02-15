import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { Loop, ProductWithPrice } from 'types';
import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

export const updateUserEmail = async (userId: string, email: string) => {
  await supabase
    .from('users')
    .update({
      email
    })
    .eq('id', userId);
};

export const insertUserLoops = async (userId: string, loops: Loop) => {
  const { error } = await supabase.from('loops').insert({
    ...loops
  });
  if (error) {
    console.log(error.message);
    throw error;
  }
};

export const deleteUserLoops = async (loopId: string) => {
  const { error } = await supabase.from('loops').delete().eq('ident', loopId);
  if (error) {
    console.log(error.message);
    throw error;
  }
};

export const getUserLoops = async (userId: string) => {
  const { data, error } = await supabase
    .from('loops')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data;
};
