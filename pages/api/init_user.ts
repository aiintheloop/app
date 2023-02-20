import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { Novu, ChatProviderIdEnum } from '@novu/node';

export default withApiAuth(async function createCheckoutSession(
  req,
  res,
  supabaseServerClient
) {
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? ""

  if (req.method === 'POST') {
    try {
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      if (!user) throw Error('Could not get user')


      const novu = new Novu(NOVU_SECRET);

      await novu.subscribers.identify(user.id, {
        email: user.email
      });
      supabaseServerClient.from("Users").update({"init" : true});

      return res.status(200).end('Success');
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});