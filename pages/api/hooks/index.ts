import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth'
import withExceptionHandler from '@/utils/withExceptionHandler';
import { HookService } from '../../../services/hookService';



/**
 * @swagger
 * /api/hook:
 *   post:
 *     summary: Creates an Approval
 *     tags:
 *      - Approvals
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Approval'
 *     responses:
 *       200:
 *         description: The Approval Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalResponse'
 */
async function hooks(req: any, res: any, userId : string) {
  const hookService = new HookService(userId);
  const { method } = req;
  const { query } = req;
  const type = query.type;
  switch (method) {
    case 'GET':
        const hook = await hookService.fetchAll(type);
        return res.status(200).json({ message : 'Hooks fetched successfully', status : 200, data : hook });

    default:
      return res.status(405).end({message : 'Method Not Allowed', status : 405});
  }
}

export default withExceptionHandler(withAuth(hooks));