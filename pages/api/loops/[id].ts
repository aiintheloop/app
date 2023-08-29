import withAuth from '@/utils/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { LoopService } from '../../../services/loopService';
import withExceptionHandler from '@/utils/withExceptionHandler';

//Todo
async function loops(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { method } = req;
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({status : 400, message: "id shouldn't be an array" });
  }
  if (!req.query.id) {
    return res.status(400).json({status : 400, message: 'id is required' });
  }
  const loopService = new LoopService(userId);

  if (method === 'GET') {
    const loop = await loopService.getLoop(id);
    return res.status(200).json({ status: '200', data : loop, message: "Successfully load loop"});

  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
  if (req.method === 'POST') {

  }
}

export default withExceptionHandler(withAuth(loops));