import { Queue } from 'quirrel/next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types_db';
import axios from 'axios';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const WebhookQueue = Queue('api/queues/webhook', async (job: any) => {
  const { event, webhook } = job;
  const headerName = 'aai';


    const headers = {
      'User-Agent': headerName + '-Webhook/1.0',
      'Content-Type': 'application/json'
    }

  console.log(webhook.subscriberUrl);
  try {
    try {
      const response = await axios.post(webhook.subscriberUrl, event.payload, {
        headers : headers,
        timeout : 10000
      });
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'sended' }).match({ 'approval': webhook.approvalId });
      if (supabaseResponse.error) {
        console.error('Failed to update Status for ');
      }
    } catch (error) {
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'failed' }).match({ 'approval': webhook.approvalId });
      if (supabaseResponse.error) {
        console.error(`Failed to update Status for `);
      }
      throw new Error(`Failed to send webhook for approval ${webhook.approvalId}`);
    }
    // update this event webhook status in events DB so the user knows the status
  } catch (error: any) {
    if (error.code && error.code === 'ECONNABORTED') {
      throw new Error('Response exceeded timeout of : ' + 10000 + 'ms');
    }
    if (error.response && error.response.status) {
      throw new Error('Callback POST failed with status code: ' + error.response.status);
    }
    throw new Error(error)
  }
});
export default WebhookQueue;