import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth'
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { ApprovalService } from '../../../services/approvalService';
import { Approval } from '../../../models/approval';




async function approvals(req: NextApiRequest, res: NextApiResponse, userId : string) {
  console.log(req.body)
  console.log("hallo")
  const approvalService = new ApprovalService(userId);
  const { method } = req;
  switch (method) {
    case 'GET':
      const approvals = await approvalService.fetchAll();
      return res.status(200).json({ approvals });
    case 'POST':
      console.log(req.body)
      if (!req.body) {
        return res.status(400).json({ message: 'content is required' });
      }
      const approval = req.body;
      const createdApproval = await approvalService.create(approval);
      return res.status(200).json({ createdApproval });
    default:
      return res.status(405).end({message : 'Method Not Allowed', status : 405});
  }
}

export default withAuth(approvals);