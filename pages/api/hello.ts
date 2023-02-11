import { supabase } from '@/utils/supabase-client';
import withAuth from '@/utils/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';



/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Check if api key valid
 *     responses:
 *       200:
 *         description: If API Key is valid
 */
const ping = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    result: 'pong',
  });
};

export default withAuth(ping);