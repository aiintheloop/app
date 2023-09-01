import { getApproval } from 'utils/supabase-admin';
import WebhookNotifier from '@/utils/WebhookNotifier';
import { supabase } from '@/utils/supabase-client';


/**
 * @swagger
 *  /approve/{id}:
 *     post:
 *       tags:
 *         - Approvals
 *       summary: Approve a request
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: object
 *               required:
 *                 - content
 *       responses:
 *         '200':
 *           description: Request successfully approved
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: '200'
 *                   message:
 *                     type: string
 *                     example: 'Approved'
 *         '500':
 *           description: Error occurred during approval process
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: '500'
 *                   message:
 *                     type: string
 *                     example: 'Approving failed'
 */
export default async function approve(
  req: any,
  res: any
) {
  if (req.method === 'POST') {
    const approvalId = req.query.id;
    const body = req.body;
    const content = body.content;
    const image = body.image;
    const video = body.video;

    try {
      const approvalData = await getApproval(approvalId);
      if (approvalData.data?.loop_id) {
        try {
          await WebhookNotifier.sendApprove(approvalData.data.loop_id, approvalId, { "content" : content, "video" : video, "image" :image });
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
