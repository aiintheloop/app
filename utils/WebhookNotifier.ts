// WebhookNotifier.ts

import WebhookQueue from 'pages/api/queues/webhook';
import { supabase } from '@/utils/supabase-client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types_db';
import { uuid4 } from '@sentry/utils';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default class WebhookNotifier {
  static async sendEvent(loopId : string, approvalId : string, data : string) {
    const process = await supabaseAdmin.from('loops').select().eq('ident', loopId).single()
    if (process.data) {
      const loopData = process.data;
      // Adding to the queue
      const webhookResponse = await supabaseAdmin.from('webhooks').insert({
        id: uuid4(),
        approval: approvalId,
        status: 'enqueued'
      });
      if (!webhookResponse.error) {
        await WebhookQueue.enqueue(
          {
            webhook: {
              processID: loopData.ident,
              approvalId: approvalId,
              subscriberUrl: loopData.afterLoopHook
            },
            event: {
              type: 'approval',
              payload: {
                type: 'approval',
                data: data
              }
            }
          },
          {
            retry: ['10sec', '5min', '1h'] // or output of https://www.npmjs.com/package/exponential-backoff-generator
          }
        );
        return
      } else {
        throw new Error(`Failed to send webhook with reason '${webhookResponse.error}' and status '${webhookResponse.status}'`)
      }
    }
    throw new Error(`Failed to load process with id: ${loopId}`)
    }
  }
