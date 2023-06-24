import { getApproval } from 'utils/supabase-admin';
import WebhookNotifier from '@/utils/WebhookNotifier';
import { supabase } from '@/utils/supabase-client';


/**
 * @swagger
 * /api/reloop/{id}:
 *   post:
 *     summary: Reloop based on the approval
 *     tags:
 *      - Loops
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The ID of the approval
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompts:
 *                 type: array
 *                 description: Array of strings containing the prompts for the loop.
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Loop has been relooped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '200'
 *                 message:
 *                   type: string
 *                   example: 'Approved'
 *       500:
 *         description: Failed to reloop
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Approving failed'
 */

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
