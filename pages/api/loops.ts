import { getApproval } from 'utils/supabase-admin';
import WebhookNotifier from '@/utils/WebhookNotifier';
import { supabase } from '@/utils/supabase-client';


/**
 * @swagger
 * definitions:
 *   Loops:
 *     required:
 *       - id
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       path:
 *         type: string
 */

/**
 * @swagger
 * /loops:
 *   get:
 *     description: Returns all Loops for a User
 *     tags:
 *      - Loops
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *            type: object
 *            $ref: '#/definitions/Login
 */
export default async function loops(
  req: any,
  res: any
) {
  if (req.method === 'GET') {
    const approvalId = req.query.id;
    try {
      const approvalData = await getApproval(approvalId);
      if (approvalData.data?.loop_id && approvalData.data?.content) {
        try {
          await WebhookNotifier.sendEvent(approvalData.data.loop_id, approvalId, approvalData.data.content);
          const approvalResponse = await supabase.from('approvals').update({ approved: true }).eq('ID', approvalId);
          if(approvalResponse.error) {
            console.error(`Failed to set approval to approved with error ${approvalResponse.error}`);
            return res.status(500).json({ status: '500', message: 'Approving failed' });
          }
          console.log("bla")
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
