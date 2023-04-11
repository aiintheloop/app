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

      if(typeof webhook !== 'string') {
        return res.redirect(307, '/account')
        throw Error("Failed to add discord webhook")
      }
      const novu = new Novu(NOVU_SECRET);
      await novu.subscribers.setCredentials(user.id, ChatProviderIdEnum.Discord, {
        webhookUrl: webhook,
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
