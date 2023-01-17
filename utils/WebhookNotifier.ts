// WebhookNotifier.ts

import WebhookQueue from 'pages/api/queues/webhook';
import { supabase } from '@/utils/supabase-client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types_db';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default class WebhookNotifier {
  static async sendEvent(processID : string, approvalId : string, data : string) {
    const process = await supabaseAdmin.from('processes').select().eq('ident', processID).single()
    if(process.data) {
      const processData = process.data
      // Adding to the queue
      const webhookResponse = await supabaseAdmin.from('webhooks').insert({
        approval : approvalId,
        status : "enqueued"
      })
      if(webhookResponse.status == 200) {
        console.log(webhookResponse)
        await WebhookQueue.enqueue(
          {
            webhook: {
              processID: processData.ident,
              approvalId: approvalId,
              subscriberUrl: processData.webhook,
            },
            event: {
              type: "approval",
              payload: {
                type: "approval",
                data: data,
              },
            },
          },
          {
            retry: ['10sec', '5min', '1h'], // or output of https://www.npmjs.com/package/exponential-backoff-generator
          }
        );
      } else {
        //Todo
      }
    }
    }
  }
