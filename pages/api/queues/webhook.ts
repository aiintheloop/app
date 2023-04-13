import { Queue } from 'quirrel/next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types_db';
import axios from 'axios';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
//TODO
const WebhookQueue = Queue('api/queues/webhook', async (job: any) => {
  const { event, payload } = job;
  const headerName = 'aai';


    const headers = {
      'User-Agent': headerName + '-Webhook/1.0',
      'Content-Type': 'application/json'
    }

  console.log(event.subscriberUrl);
  try {
    try {
      const response = await axios.post(event.subscriberUrl, payload, {
        headers : headers,
        timeout : 10000
      });
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'sended' }).match({ 'id': event.webhookID});
      if (supabaseResponse.error) {
        console.error(`Failed to update Status for webhook ${event.webhookID}`);
      }
    } catch (error) {
      const supabaseResponse = await supabaseAdmin.from('webhooks').update({ status: 'failed' }).match({ 'id': event.webhookID});
      if (supabaseResponse.error) {
        console.error(`Failed to update Status for for webhook ${event.webhookID}`);
      }
      throw new Error(`Failed to send webhook for approval ${event.approvalId} with error: ${JSON.stringify(error)}`);
    }
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