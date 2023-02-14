import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { Novu, ChatProviderIdEnum } from '@novu/node';
import axios from 'axios';


function generateRequest(code :string, client_id :string, client_secret :string, url: string) {
  let slackUrl = `https://slack.com/api/oauth.v2.access`;
  let details = {
    "code" : code,
    "client_id" : client_id,
    "client_secret" : client_secret,
    "redirect_uri" : url
  }
  let formBody = [];
  for (let property in details) {
    var encodedKey = encodeURIComponent(property);
    // @ts-ignore
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  const formBodyString = formBody.join("&");

  const _headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  let config = {
    method: 'POST',
    url: slackUrl,
    data: formBodyString,
    headers: _headers
  };
  return config;
}

const SLACK_CLIENT_SECRET = process?.env?.SLACK_CLIENT_SECRET ?? ""
const SLACK_CLIENT_ID = process?.env?.SLACK_CLIENT_ID ?? ""


export default withApiAuth(async function createCheckoutSession(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'GET') {
    const {code} = req.query
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user')
      if(typeof code !== 'string') {
        return res.redirect(307, '/account?error=true')
      }
      const response = await axios(generateRequest(code,SLACK_CLIENT_ID,SLACK_CLIENT_SECRET, getURL()))

      const novu = new Novu("1d09c211bd7b49867e3a31500e0776d4");
      await novu.subscribers.setCredentials(user.id, ChatProviderIdEnum.Slack, {
        webhookUrl: response.data.incoming_webhook.url,
      });

      return res.redirect(307, '/account')
    } catch (err: any) {
      console.log(err);
      return res.redirect(307, '/account?error=true')
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
