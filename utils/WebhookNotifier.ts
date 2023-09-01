// WebhookNotifier.ts

import WebhookQueue from 'pages/api/queues/webhook';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types_db';
import { uuid4 } from '@sentry/utils';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default class WebhookNotifier {
  static async sendApprove(loopId: string, approvalId: string, data: any) {
    const process = await supabaseAdmin
      .from('loops')
      .select()
      .eq('ident', loopId)
      .single();
    if (process.data) {
      const loopData = process.data;
      // Adding to the queue
      const webhookID = uuid4()
      const webhookResponse = await supabaseAdmin.from('webhooks').insert({
        id: webhookID,
        user_id: loopData.user_id,
        payload: {data: data},
        type: "acceptHook",
        approval: approvalId,
        status: 'enqueued'
      });
      if (!webhookResponse.error) {
        const response = await WebhookQueue.enqueue(
          {
            event: {
              type: 'approve',
              approvalId: approvalId,
              loopID: loopData.ident,
              subscriberUrl: loopData.acceptHook,
              webhookID: webhookID
            },
            payload: {
              data: data
            }

          },
          {
            retry: ['10sec', '5min', '1h'] // or output of https://www.npmjs.com/package/exponential-backoff-generator
          }
        );
        return;
      } else {
        throw new Error(
          `Failed to send webhook with reason '${JSON.stringify(webhookResponse.error)}' and status '${webhookResponse.status}'`
        );
      }
    }
    throw new Error(`Failed to load process with id: ${loopId}`);
  }

  static async sendReloop(loopId: string, approvalId: string, prompts: string) {
    const process = await supabaseAdmin
      .from('loops')
      .select()
      .eq('ident', loopId)
      .single();
    if (process.data) {
      const loopData = process.data;
      // Adding to the
      const webhookID = uuid4()
      const webhookResponse = await supabaseAdmin.from('webhooks').insert({
        id: webhookID,
        approval: approvalId,
        user_id: loopData.user_id,
        payload: {
          prompts: prompts
        },
        type: "declineHook",
        status: 'enqueued'
      });
      if (!webhookResponse.error) {
        const response = await WebhookQueue.enqueue(
          {
            event: {
              type: 'reLoop',
              loopID: loopData.ident,
              subscriberUrl: loopData.declineHook,
              webhookID: webhookID
            },
            payload: {
              prompts: prompts
            }
          },
          {
            retry: ['10sec', '5min', '1h'] // or output of https://www.npmjs.com/package/exponential-backoff-generator
          }
        );
        return;
      } else {
        throw new Error(
          `Failed to send webhook with reason '${JSON.stringify(webhookResponse.error)}' and status '${webhookResponse.status}'`
        );
      }
    }
    throw new Error(`Failed to load process with id: ${loopId}`);
  }


  static async sendStart(loopId: string, prompts: any) {
    const loop = await supabaseAdmin
      .from('loops')
      .select()
      .eq('ident', loopId)
      .single();

    if (loop.data) {
      const loopData = loop.data;
      if(loopData.declineHook) {
        // Adding to the queue
        const webhookID = uuid4()
        const webhookResponse = await supabaseAdmin.from('webhooks').insert({
          id: webhookID,
          status: 'enqueued',
          user_id: loopData.user_id,
          payload: {
            prompts: prompts
          },
          type: "declineHook"
        });
        if (!webhookResponse.error) {
          const response = await WebhookQueue.enqueue(
            {
              event: {
                type: 'startLoop',
                loopID: loopData.ident,
                subscriberUrl: loopData.declineHook,
                webhookID: webhookID
              },
              payload: {
                prompts: prompts
              }
            },
            {
              retry: ['10sec', '5min', '1h'] // or output of https://www.npmjs.com/package/exponential-backoff-generator
            }
          );
        } else {
          throw new Error(
            `Failed to send webhook with reason '${JSON.stringify(webhookResponse.error)}' and status '${webhookResponse.status}'`
          );
        }
      }
    } else {
      throw new Error(`Failed to load loop with id: ${loopId}`);
    }
  }
}
