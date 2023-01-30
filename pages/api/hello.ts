import { supabase } from '@/utils/supabase-client';



/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */
export default async function approve(
  req: any,
  res: any
) {
  res.status(200).json({
    result: 'hello world',
  });
};
