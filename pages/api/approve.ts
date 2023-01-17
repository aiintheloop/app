import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer, getApproval } from 'utils/supabase-admin';
import { getURL } from 'utils/helpers';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import WebhookNotifier from '@/utils/WebhookNotifier';

export default async function approve(
  req : any,
  res : any
) {
  if (req.method === 'GET') {
    const approvalId = req.query.id
    try {
      const approvalData = await getApproval(approvalId);
      if(approvalData.data?.process_id && approvalData.data?.content) {
        const webhookResponse = await WebhookNotifier.sendEvent(approvalData.data.process_id, approvalId, approvalData.data.content)
        return res.status(200).json({});
      } else {
        return res.status(500).json('error');
      }

    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
