import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices, updateUserEmail } from 'utils/supabase-client';
import { Product } from 'types';
import { GetStaticPropsResult } from 'next';
import { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';



export default function Home() {


  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/loops');
    } else {
      router.replace('/signin');
    }
  }, [user]);


  return <div/>;
}
