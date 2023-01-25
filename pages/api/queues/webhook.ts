import { Queue } from 'quirrel/next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types_db';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const WebhookQueue = Queue('api/queues/webhook', async (job: any) => {
  const { event, webhook } = job;
  const headerName = 'aai';

  const config = {
    headers: {
      'User-Agent': headerName + '-Webhook/1.0',
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };
  console.log(webhook.subscriberUrl);
  try {
    const response = await fetch(webhook.subscriberUrl, { //Todo change to axios
      body: JSON.stringify(event.payload),
      ...config
    });
    if (response.ok) {
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'sended' }).match({ 'approval': webhook.approvalId });
      if (supabaseResponse.error) {
        console.error('Failed to update Status for ');
      }
    } else {
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'failed' }).match({ 'approval': webhook.approvalId });
      if (supabaseResponse.error) {
        console.error(`Failed to update Status for `);
      }
      throw new Error(`Failed to send webhook for approval ${webhook.approvalId}`);
    }

    // update this event webhook status in events DB so the user knows the status
  } catch (error: any) {
    console.log(error);
    if (error.code && error.code === 'ECONNABORTED') {
      throw new Error('Response exceeded timeout of : ' + 10000 + 'ms');
    }

    if (error.response && error.response.status) {
      throw new Error('Callback POST failed with status code: ' + error.response.status);
    }
  }
});
export default WebhookQueue;