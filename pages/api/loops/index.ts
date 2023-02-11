import withAuth from '@/utils/withAuth';
import { LoopService } from '../../../services/loopService';

/**
 * @swagger
 * /api/loops:
 *   get:
 *     summary: Returns all Loops for a User
 *     tags:
 *      - Loops
 *     responses:
 *       200:
 *         description: The list of all Loops
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoopResponse'
 */
async function index(
  req: any,
  res: any,
  userId: string
) {
  if (req.method === 'GET') {
    const loopService = new LoopService(userId);
    try {
      res.status(200).json({ status: '200', data : await loopService.getAllLoops(), message : 'Fetch loop successfully'});
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ status: '500', message: 'Failed to get loop'});
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};

export default withAuth(index);