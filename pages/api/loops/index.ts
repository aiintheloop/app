import withAuth from '@/utils/withAuth';
import { LoopService } from '../../../services/loopService';

/**
 * @swagger
 * /api/loops:
 *   get:
 *     summary: Returns all Loops for a User
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The tool for which the loop is deployed
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
      const { query } = req;
      const tool = query.tool;

      const data = await loopService.getAllLoops(tool);
      res.status(200).json({ status: '200', data : data, message : 'Fetch loop successfully'});
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