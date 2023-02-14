import Link from 'next/link';
import { ReactNode, useState } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { User } from '@supabase/supabase-js';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { TextField } from '@mui/material';
import { getURL } from '@/utils/helpers';



interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const SLACK_CLIENT_ID = process?.env?.SLACK_CLIENT_ID ?? ""

function Card({ title, description, footer, children }: Props) {
  return (
    <div className='border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8'>
      <div className='px-5 py-4'>
        <h3 className='text-2xl mb-1 font-medium'>{title}</h3>
        <p className='text-zinc-900'>{description}</p>
        {children}
      </div>
      <div className='border-t border-zinc-700 bg-zinc-200 p-4 text-zinc-500 rounded-b-md'>
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className='bg-neutral-100 mb-32'>
      <div className='max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:flex-col sm:align-center'>
          <h1 className='text-4xl font-extrabold text-black sm:text-center sm:text-6xl'>
            Account
          </h1>
          <p className='mt-5 text-xl text-zinc-800 sm:text-center sm:text-2xl max-w-2xl m-auto'>
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className='p-4'>
        <Card
          title='Your Plan'
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
          footer={
            <div className='flex items-start justify-between flex-col sm:flex-row sm:items-center'>
              <p className='pb-4 sm:pb-0'>
                Manage your subscription on Stripe.
              </p>
              <Button
                variant='slim'
                loading={loading}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className='text-xl mt-8 mb-4 font-semibold'>
            {isLoading ? (
              <div className='h-12 mb-6'>
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href='/'>
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>
        <Card
          title='Your Name'
          description='Please enter your full name, or a display name you are comfortable with.'
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className='text-xl mt-8 mb-4 font-semibold'>
            {userDetails ? (
              `${
                userDetails.full_name ??
                `${userDetails.first_name} ${userDetails.last_name}`
              }`
            ) : (
              <div className='h-8 mb-6'>
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title='Your Email'
          description='Please enter the email address you want to use to login.'
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className='text-xl mt-8 mb-4 font-semibold'>
            {user ? user.email : undefined}
          </p>
        </Card>
        <Card
          title='Slack Integration'
          description='Please authenticate with Slack if you want the Approvals in your slack channel'
          footer={<p>Repress the button if you want to change the Channel</p>}
        >
          <p className='text-xl mt-8 mb-4 font-semibold'>
            <a
              href={`https://slack.com/oauth/v2/authorize?scope=incoming-webhook&redirect_uri=${encodeURIComponent(getURL()+'api/integrate_slack')}&client_id=${SLACK_CLIENT_ID}`}
              style={{"alignItems":"center","color":"#000","backgroundColor":"#fff","border":"1px solid #ddd","borderRadius":"4px","display":"inline-flex","fontFamily":"Lato, sans-serif","fontSize":"16px","fontWeight":"600","height":"48px","justifyContent":"center","textDecoration":"none","width":"236px"}}>
              <svg xmlns='http://www.w3.org/2000/svg' style={{"height":"20px","width":"20px","marginRight":"12px"}}
                   viewBox='0 0 122.8 122.8'>
                <path
                  d='M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z'
                  fill='#e01e5a'></path>
                <path
                  d='M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z'
                  fill='#36c5f0'></path>
                <path
                  d='M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z'
                  fill='#2eb67d'></path>
                <path
                  d='M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z'
                  fill='#ecb22e'></path>
              </svg>
              Add to Slack</a>
          </p>
        </Card>
        <Card
          title='Discord Integration'
          description='Please enter a Discord Webhook'
          footer={<p><a href={'https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'}>More Infos</a></p>}
        >
          <p className='flex items-start flex-row mt-8 mb-4 font-semibold'>
            <TextField className={'w-full mr-5'} id="outlined-basic" label="Webhook" variant="outlined" />
            <Button className={'w-96'}>Add</Button>
          </p>
        </Card>
      </div>
    </section>
  );
}
