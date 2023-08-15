import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import LoadingDots from 'components/ui/LoadingDots';
import Logo from 'components/icons/Logo';
import { getURL } from '@/utils/helpers';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import Link from 'next/link';
import { getUserDetails, updateUserEmail } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import axios from 'axios';

const SignIn = () => {
  const router = useRouter();
  const { user, userDetails, setUserDetails } = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    async function updateUser() {
      if (!user) return;
      if (!user.email) return;
      await updateUserEmail(user.id, user.email);
    }
    async function initUser() {
      if (!user) return;
      const res: Response = await axios.post(
        'api/init_user',
        { email: 'user.email' },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      await getUserDetails(user.id).then((res) => {
        setUserDetails(res);
      });
    }
    if (user) {
      if (userDetails?.email !== user.email) updateUser();
      if (userDetails && !userDetails.init) initUser();
      router.replace('/loops');
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <Logo width="100px" height="100px" />
          </div>
          <div className="flex flex-col">
            <Auth
              supabaseClient={supabaseClient}
              providers={['github', 'google']}
              redirectTo={getURL()}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#404040',
                      brandAccent: '#000000'
                    }
                  }
                }
              }}
              theme="dark"
            />
            <div className="flex place-items-center m-auto">
              <span className="text-xs text-center">
                By continuing you agree to our{' '}
                <Link href="https://www.ai2loop.com/toc" target={'_blank'}>
                  <a className="text-accent">Privacy Policy</a>
                </Link>{' '}
                and{' '}
                <Link href="https://www.ai2loop.com/toc" target={'_blank'}>
                  <a className="text-accent">Terms of Use</a>
                </Link>
                .
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
