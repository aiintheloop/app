import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth'
import { ApprovalService } from '../../../services/approvalService';





async function approvals(req: NextApiRequest, res: NextApiResponse, userId : string) {
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? ""
  const approvalService = new ApprovalService(userId,NOVU_SECRET);
  const { method } = req;
  switch (method) {
    case 'GET':
      const approvals = await approvalService.fetchAll();
      return res.status(200).json({ approvals });
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

export default withAuth(approvals);