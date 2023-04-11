import { getApproval } from 'utils/supabase-admin';
import WebhookNotifier from '@/utils/WebhookNotifier';
import { supabase } from '@/utils/supabase-client';

export default async function reloop(
  req: any,
  res: any
) {
  if (req.method === 'POST') {
    const approvalId = req.query.id;
    const body = req.body;
    const prompts = body.prompts;
    try {
      const approvalData = await getApproval(approvalId);
      if (approvalData.data?.loop_id) {
        try {
          await WebhookNotifier.sendReloop(approvalData.data.loop_id, approvalId, prompts);
          const approvalResponse = await supabase.from('approvals').update({ approved: true }).eq('ID', approvalId);
          if(approvalResponse.error) {
            console.error(`Failed to set approval to approved with error ${approvalResponse.error}`);
            return res.status(500).json({ status: '500', message: 'Approving failed' });
          }

          return res.status(200).json({ status: '200', message: 'Approved' });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ status: '500', message: 'Approving failed' });
        }
      }
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ status: '500', message: 'Approving failed' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
