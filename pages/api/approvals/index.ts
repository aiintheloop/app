import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth'
import { ApprovalService } from '../../../services/approvalService';
import withExceptionHandler from '@/utils/withExceptionHandler';


/**
 * @swagger
 * /api/approvals:
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
async function approvals(req: NextApiRequest, res: NextApiResponse, userId : string) {
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? ""
  const approvalService = new ApprovalService(userId,NOVU_SECRET);
  const { method } = req;
  switch (method) {
    case 'GET':
        const approvals = await approvalService.fetchAll();
        return res.status(200).json({ message : 'Approvals fetched successfully', status : 200, data : approvals });
    case 'POST':
      if (!req.body) {
        return res.status(400).json({ message: 'content is required' });
      }
      const approval = req.body;
      const createdApproval = await approvalService.create(approval);
      return res.status(201).json(createdApproval);
    default:
      return res.status(405).end({message : 'Method Not Allowed', status : 405});
  }
}

export default withExceptionHandler(withAuth(approvals));