import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';
import { Process, UserDetails } from 'types';
import { Subscription } from 'types';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  processes: Process[] | null;
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
  const [processes, setProcesses] = useState<Process[] | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();
  const getUserProcesses = () =>
    supabase.from('processes').select('*').eq('user_id', user?.id);

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription && !processes) {
      setIsloadingData(true);
      Promise.allSettled([
        getUserDetails(),
        getSubscription(),
        getUserProcesses()
      ]).then((results) => {
        const userDetailsPromise = results[0];
        const subscriptionPromise = results[1];
        const processesPromise = results[2];

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data);

        if (subscriptionPromise.status === 'fulfilled')
          setSubscription(subscriptionPromise.value.data);

        if (processesPromise.status === 'fulfilled')
          setProcesses(processesPromise.value.data);

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
    processes
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
