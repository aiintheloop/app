import withAuth from '@/utils/withAuth';
import { LoopService } from '../../services/loopService';
import { NextApiRequest, NextApiResponse } from 'next';
import Ajv, {JSONSchemaType} from "ajv"
import addFormats from "ajv-formats"
import { ServiceError } from '../../services/exception/ServiceError';
import { RegisterHookRequest } from '../../models/registerHookRequest';
const ajv = new Ajv()
addFormats(ajv)


const schema: JSONSchemaType<RegisterHookRequest> = {
  type: "object",
  properties: {
    type: {type: "string"},
    url: {type: "string", format : "uri"},
    loopId: {type: "string", format: "uuid"},
  },
  required: ["type","url","loopId"],
  additionalProperties: false
}
const validate = ajv.compile(schema)

/**
 * @swagger
 * /api/registerHook:
 *   post:
 *     summary: Register a hook for a certain loop
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterHookRequest'
 *     responses:
 *       200:
 *         description: RegisterHookResponse
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DefaultResponse'
 */
async function registerHook(req: NextApiRequest, res: NextApiResponse,
  userId: string
) {
  if (req.method === 'POST') {
    const loopService = new LoopService(userId);
    const body = req.body;
    if (validate(body)) {
      try {
        await loopService.registerHook(body.loopId, body.type, body.url)
        res.status(200).json({ status: '200', message : 'Webhook registered successfully'});
      } catch (error) {
        if(error instanceof ServiceError) {
          res.status(400).json({ status: '400' , message: error.message});
        } else {
          res.status(500).json({ status: '500' , message: "Unexpected Error"});
        }
      }
    } else {
      res.status(400).json({ status: '400', data : validate.errors, message: "Failed to register Webhook"});
    }

  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default withAuth(registerHook);