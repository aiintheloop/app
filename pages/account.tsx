import Link from 'next/link';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { generateNewApiKey, getApiKey, postData } from 'utils/helpers';

import { User } from '@supabase/supabase-js';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { TextField } from '@mui/material';
import { getURL } from '@/utils/helpers';
import { getUserDetails, supabase } from '@/utils/supabase-client';
import { v4 as uuidv4 } from 'uuid';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ApiKeyModal from '@/components/ui/Modal/ApiKeyModal';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="card bg-base-200 max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p>{description}</p>
        {children}
      </div>
      <div className="px-5 py-3 rounded-b-md bg-base-300 shadow-inner">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails, setUserDetails } = useUser();
  const [apiKey, setApiKey] = useState('');
  const [hideApiKey, setHideApiKey] = useState(true);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [discordWebhook, setDiscordWebhook] = useState<string>('');
  const [teamsWebhook, setTeamsWebhook] = useState<string>('');

  const SLACK_CLIENT_ID = process?.env?.NEXT_PUBLIC_SLACK_CLIENT_ID;

  useEffect(() => {
    if (user) {
      getApiKey(user.id).then((data) => {
        if (data && data[0].api_key != null) {
          setApiKey(data[0].api_key);
        }
      });
    }
  }, [user]);

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

  const regenerateApiKey = async () => {
    setApiKey(await generateNewApiKey(user.id));
  };

  const handleCopy = () => {
    toast.info('API Key copied to clipboard');
  };

  const handleDiscordIntegration = async () => {
    // Fix for missing delete function -> otherwise following messages are not sended by novu
    const webhook =
      discordWebhook !== '' ? discordWebhook : 'https://httpstat.us/200';
    axios
      .post(`api/integrate_discord`, { webhook: webhook })
      .then(async (response) => {
        console.log(response);
        await getUserDetails(user.id).then((data) => {
          if (data) setUserDetails(data);
        });
        toast.info(response.data.message);
      })
      .catch((response) => {
        console.log(response);
        toast.error(response.data.message);
      });
  };

  const handleTeamsIntegration = async () => {
    // Fix for missing delete function -> otherwise following messages are not sended by novu
    const webhook =
      teamsWebhook !== '' ? teamsWebhook : 'https://httpstat.us/200';
    axios
      .post(`api/integrate_teams`, { webhook: webhook })
      .then(async (response) => {
        await getUserDetails(user.id).then((data) => {
          if (data) setUserDetails(data);
        });
        toast.info(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Unexpected Error');
        }
      });
  };

  const handleDiscordWebhookChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDiscordWebhook(event.target.value);
  };

  const handleTeamsWebhookChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTeamsWebhook(event.target.value);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="mt-5 text-xl sm:text-center sm:text-2xl max-w-2xl m-auto">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <ApiKeyModal
          generateApiKey={regenerateApiKey}
          modalOpen={apiKeyModalOpen}
          setModalOpen={setApiKeyModalOpen}
        />
        {/** <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              <button
                className={`btn btn-primary btn-md ${
                  loading && 'loading'
                } disabled:bg-primary disabled:bg-opacity-50 disabled:text-zinc-800`}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </button>
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>**/}
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
        <Card
          title="Your API Key"
          description="Please keep this Key confidential."
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p>Your Api Key</p>
              <button
                className={'btn btn-primary btn-md'}
                onClick={() => setApiKeyModalOpen(true)}
              >
                Generate new API-KEY
              </button>
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {userDetails ? (
              <div className="flex item-center justify-between">
                <p>
                  {hideApiKey ? '*********************' : apiKey ? apiKey : ''}
                </p>
                <div>
                  {hideApiKey ? (
                    <VisibilityIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => setHideApiKey(false)}
                    />
                  ) : (
                    <VisibilityOffIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => setHideApiKey(true)}
                    />
                  )}

                  <CopyToClipboard text={apiKey} onCopy={() => handleCopy()}>
                    <ContentPasteIcon
                      style={{ marginLeft: '20px', cursor: 'pointer' }}
                    />
                  </CopyToClipboard>
                </div>
              </div>
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Slack Integration"
          description="Please authenticate with Slack if you want the Approvals in your slack channel"
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p>Repress the button if you want to change the Channel</p>
              <p>
                <a
                  href={`https://slack.com/oauth/v2/authorize?scope=incoming-webhook&redirect_uri=${encodeURIComponent(
                    getURL() + 'api/integrate_slack'
                  )}&client_id=${SLACK_CLIENT_ID}`}
                  className="btn btn-primary btn-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      height: '20px',
                      width: '20px',
                      marginRight: '12px'
                    }}
                    viewBox="0 0 122.8 122.8"
                  >
                    <path
                      d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
                      fill="#e01e5a"
                    ></path>
                    <path
                      d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
                      fill="#36c5f0"
                    ></path>
                    <path
                      d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
                      fill="#2eb67d"
                    ></path>
                    <path
                      d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                      fill="#ecb22e"
                    ></path>
                  </svg>
                  Add to Slack
                </a>
              </p>
            </div>
          }
        ></Card>
        <Card
          title="Discord Integration"
          description="Please enter a Discord Webhook"
          footer={
            <p>
              <a
                href={
                  'https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks'
                }
              >
                More Infos
              </a>
            </p>
          }
        >
          <p className="mt-5 flex items-center flex-row mb-4 font-semibold">
            <input
              aria-label="Discord Webhook"
              type="text"
              placeholder="Discord Webhook"
              className="input input-bordered input-primary w-full"
              onChange={handleDiscordWebhookChange}
            />
            <button
              onClick={handleDiscordIntegration}
              className={'ml-5 btn btn-primary'}
            >
              Add to Discord
            </button>
          </p>
        </Card>
        <Card
          title="Teams Integration"
          description="Please enter a Teams Webhook"
          footer={
            <p>
              <a
                href={
                  'https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=dotnet'
                }
              >
                More Infos
              </a>
            </p>
          }
        >
          <p className="mt-5 flex items-center flex-row mb-4 font-semibold">
            <input
              aria-label="Teams Webhook"
              type="text"
              placeholder="Teams Webhook"
              className="input input-bordered input-primary w-full"
              onChange={handleTeamsWebhookChange}
            />
            <button
              onClick={handleTeamsIntegration}
              className={'ml-5 btn btn-primary'}
            >
              Add to Teams
            </button>
          </p>
        </Card>
      </div>
    </section>
  );
}
