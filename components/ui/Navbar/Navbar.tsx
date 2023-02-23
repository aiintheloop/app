import Link from 'next/link';
import s from './Navbar.module.css';

import Logo from 'components/icons/Logo';
import { useRouter } from 'next/router';
import { useUser } from 'utils/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { IMessage, NotificationBell, NovuProvider, PopoverNotificationCenter } from '@novu/notification-center';


const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  function onNotificationClick(message: IMessage) {
    // your logic to handle the notification click
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  }

  const styles = {
    header: {
      root: {
        backgroundColor: 'rgb(250 250 250)'
      },
      title: {
        color: 'black'
      },
    },
    layout:{
      root: {
        backgroundColor: 'rgb(250 250 250)',
        color: 'black',
        border: '1px solid rgb(212 212 216)',
      }
    },
    foooter: {
      root: {
        backgroundColor: 'rgb(250 250 250)',
      }
    },
    "notifications": {
      root: {
        backgroundColor: 'rgb(250 250 250)',
        color: 'black',
      },
      listItem: {
        root: {
          backgroundColor: 'black'
        },
        read: { backgroundColor: 'rgb(244 244 245)', border: '1px solid rgb(228 228 231)'},
        unread: { backgroundColor: 'rgb(250 250 250)', color: 'black',
          //'&:before': { background: '#008dd5' }
        },
      }
    },
    bellButton: {
      root: {
        color: 'black'
      },
      dot: {
        color: 'black'
      }
    }
  };

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
              <Link href="/">
                <a className={s.link}>Pricing</a>
              </Link>
              <Link href="/account">
                <a className={s.link}>Account</a>
              </Link>
              <Link href="/loops">
                <a className={s.link}>Loops</a>
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              <div className="flex flex-1 items-center justify-end space-x-2">
              <span
                className={s.link}
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                  router.push('/signin');
                }}
              >
                Sign out
              </span>
                <span>
                  <NovuProvider subscriberId={user.id} applicationIdentifier={'Z3T4PYfzymoj'} styles={styles}>
              <PopoverNotificationCenter onNotificationClick={onNotificationClick} colorScheme="light">
                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
              </PopoverNotificationCenter>
            </NovuProvider>
                </span>
              </div>
            ) : (
              <Link href="/signin">
                <a className={s.link}>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
