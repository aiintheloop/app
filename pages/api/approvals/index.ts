import { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '@/utils/withAuth'
import { ApprovalService } from '../../../services/approvalService';
import withExceptionHandler from '@/utils/withExceptionHandler';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { Approval } from '../../../models/approval';
import { hasDuplicateIdentifiers } from '@/utils/helpers';


const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<Approval> = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    content: { type: 'string' },
    video: { type: 'string' },
    image: { type: 'string' },
    approval_uri: { type: 'string' },
    created_at: { type: 'string' },
    loop_id: { type: 'string', format: 'uuid' },
    user_id: { type: 'string', format: 'uuid' },
    ID: { type: 'string', format: 'uuid' },
    type: { type: 'string' },
    prompts: {
      type : "array",
      nullable: true,
      items: {
        type : "object",
        nullable: true,
        required: []
      }
    },
  },
  required: ['loop_id'],
  additionalProperties: false
};
const validate = ajv.compile(schema);


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
      const approval = req.body;
      if (!approval) {
        return res.status(400).json({ message: 'content is required', status : 400 });
      } else if (!validate(approval)) {
        return res.status(400).json({ message: 'Failed to create approval', status : 400, data: validate.errors });
      }
      if(hasDuplicateIdentifiers(approval.prompts)) {
        return res.status(400).json({ message: 'There a duplicate identifier in the prompt definition', status : 400 });
      }

      const createdApproval = await approvalService.create(approval);
      return res.status(201).json(createdApproval);
    default:
      return res.status(405).end({message : 'Method Not Allowed', status : 405});
  }
}

export default withExceptionHandler(withAuth(approvals));