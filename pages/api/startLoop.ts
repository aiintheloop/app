import WebhookNotifier from '@/utils/WebhookNotifier';
import withAuth from '@/utils/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';

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
