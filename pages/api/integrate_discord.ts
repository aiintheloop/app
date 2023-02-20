import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { Novu, ChatProviderIdEnum } from '@novu/node';
import axios from 'axios';


export default withApiAuth(async function createCheckoutSession(
  req,
  res,
  supabaseServerClient
) {
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? ""
  if (req.method === 'GET') {
    const {webhook} = req.query
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user')

      console.log(webhook)
      if(typeof webhook !== 'string') {
        throw Error("nope")
      }
      const novu = new Novu(NOVU_SECRET);

      await novu.subscribers.setCredentials(user.id, ChatProviderIdEnum.Discord, {
        webhookUrl: 'https://discord.com/api/webhooks/1075067303999307807/vV7gYfYfPKxM7Ee01lIqRG5cCfzqMJO-IF6gA-fFOsUkiJzxlAhTEFx4DtfLOBmGPLZg',
      });

      return res.redirect(307, '/account')
    } catch (err: any) {
      console.log(err);
      return res.redirect(307, '/account')
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
