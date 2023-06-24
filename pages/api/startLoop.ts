import WebhookNotifier from '@/utils/WebhookNotifier';
import withAuth from '@/utils/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/loops/loopStart:
 *   post:
 *     summary: Starts a loop with the specified prompts
 *     tags:
 *      - Loops
 *     requestBody:
 *       description: The prompts for the loop
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loopId:
 *                 type: string
 *                 description: The ID of the loop to start
 *               prompts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of prompts for the loop
 *     responses:
 *       200:
 *         description: The loop was successfully started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The HTTP status code
 *                   example: '200'
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the request
 *                   example: 'Loop started'
 *       500:
 *         description: An error occurred while starting the loop
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The HTTP status code
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   description: A message indicating the failure of the request
 *                   example: 'Loop Start failed'
 */

async function startLoop(req: NextApiRequest, res: NextApiResponse,
                         userId: string
) {
  if (req.method === 'POST') {
    const body = req.body;
    const prompts = body.prompts;

    try {
      await WebhookNotifier.sendStart(body.loopId, prompts);
      return res.status(200).json({ status: '200', message: 'Loop started' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: '500', message: 'Loop Start failed' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
export default withAuth(startLoop);
