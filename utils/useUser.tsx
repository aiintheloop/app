import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';
import { UserDetails } from 'types';
import { Subscription } from 'types';
import { Loop } from 'models/loop';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  loops: Loop[] | null;
  setLoops: (loops: Loop[] | null) => void;
  setUserDetails: (userDetails: UserDetails | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loops, setLoops] = useState<Loop[] | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();
  const getUserProcesses = () =>
    supabase.from('loops').select('*').eq('user_id', user?.id);

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription && !loops) {
      setIsloadingData(true);
      Promise.allSettled([
        getUserDetails(),
        getSubscription(),
        getUserProcesses()
      ]).then((results) => {
        const userDetailsPromise = results[0];
        const subscriptionPromise = results[1];
        const loopsPromise = results[2];

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data);

        if (subscriptionPromise.status === 'fulfilled')
          setSubscription(subscriptionPromise.value.data);

        if (loopsPromise.status === 'fulfilled')
          setLoops(loopsPromise.value.data);

        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    setUserDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
    loops,
    setLoops
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
