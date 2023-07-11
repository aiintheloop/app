import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { ApprovalService } from '../../../services/approvalService';
import { Approval } from '../../../models/approval';
import withExceptionHandler from '@/utils/withExceptionHandler';

const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<Approval> = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    content: { type: 'string' },
    approval_uri: { type: 'string' },
    created_at: { type: 'string' },
    loop_id: { type: 'string', format: 'uuid' },
    user_id: { type: 'string', format: 'uuid' },
    ID: { type: 'string', format: 'uuid' },
    type: { type: 'string' },
    prompts: {
      type : "object",
      required : ['false']
    },
  },
  required: ['loop_id', 'content'],
  additionalProperties: false
};
const validate = ajv.compile(schema);

async function approvals(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? '';

  const approvalService = new ApprovalService(userId, NOVU_SECRET);
  const { method } = req;
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: "id shouldn't be an array" });
  }
  if (!req.query.id) {
    return res.status(400).json({ message: 'id is required' });
  }

  switch (method) {
    case 'GET':
      const approvals = await approvalService.getById(id);
      return res.status(200).json({ approvals });
    case 'PUT':
      const updatedApproval = await approvalService.update(id, req.body);
      return res.status(200).json({ updatedApproval });
    case 'DELETE':
      await approvalService.delete(id);
      return res.status(200).json({
        message: `Approval with id "${id}" deleted successfully`,
        status: 200
      });
    default:
      return res
        .status(405)
        .json({ message: 'Method Not Allowed', status: 405 });
  }
}

export default withExceptionHandler(withAuth(approvals));
