import Link from 'next/link';
import s from './Navbar.module.css';

import Logo from 'components/icons/Logo';
import { useRouter } from 'next/router';
import { useUser } from 'utils/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  IMessage,
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter
} from '@novu/notification-center';

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
        backgroundColor: '#1E293B'
      },
      title: {
        color: '#f4f4f5'
      }
    },
    layout: {
      root: {
        backgroundColor: '#1E293B',
        color: '#f4f4f5',
        border: '1px solid rgb(212 212 216)'
      }
    },
    footer: {
      root: {
        backgroundColor: '#1E293B'
      }
    },
    notifications: {
      root: {
        backgroundColor: '#1E293B',
        color: '#f4f4f5'
      },
      listItem: {
        root: {
          backgroundColor: '#0F172A'
        },
        read: {
          backgroundColor: '#0F172A',
          border: '0px solid rgb(228 228 231)'
        },
        unread: {
          backgroundColor: '#1E293B',
          color: '#f4f4f5'
          // '&:before': { background: '#008dd5' }
        }
      }
    },
    bellButton: {
      root: {
        color: '#f4f4f5'
      },
      dot: {
        color: '#f4f4f5'
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
            {user ? (
              <nav className="space-x-2 ml-6 hidden lg:block">
                {/**
              <!-- <Link href="/">
                <a className={s.link}>Pricing</a>
              </Link> **/}

                <Link href="/account">
                  <a className={s.link}>Account</a>
                </Link>
                <Link href="/loops">
                  <a className={s.link}>Loops</a>
                </Link>
              </nav>
            ) : (
              <nav className="space-x-2 ml-6 hidden lg:block"></nav>
            )}
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
                  <NovuProvider
                    subscriberId={user.id}
                    applicationIdentifier={'Z3T4PYfzymoj'}
                    styles={styles}
                  >
                    <PopoverNotificationCenter
                      onNotificationClick={onNotificationClick}
                      colorScheme="dark"
                    >
                      {({ unseenCount }) => (
                        <NotificationBell unseenCount={unseenCount} />
                      )}
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
