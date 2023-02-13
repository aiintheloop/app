import withAuth from '@/utils/withAuth';
import { LoopService } from '../../services/loopService';
import { NextApiRequest, NextApiResponse } from 'next';
import Ajv, {JSONSchemaType} from "ajv"
import addFormats from "ajv-formats"
import { ServiceError } from '../../services/exception/ServiceError';
const ajv = new Ajv()
addFormats(ajv)

interface RegisterHookRequest {
  type: string
  loopId: string
}

const schema: JSONSchemaType<RegisterHookRequest> = {
  type: "object",
  properties: {
    type: {type: "string"},
    loopId: {type: "string", format: "uuid"},
  },
  required: ["type","loopId"],
  additionalProperties: false
}

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schema)

//Todo
/**
 * @swagger
 * components:
 *   schemas:
 *     UnregisterHookResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *     UnregisterHookRequest:
 *       type: object
 *       properties:
 *         loopId:
 *           type: string
 *         type:
 *           type: string
 *
 */

/**
 * @swagger
 * /api/unregisterHook:
 *   post:
 *     summary: Unregister a hook for a certain loop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnregisterHookRequest'
 *     responses:
 *       200:
 *         description: RegisterHookResponse
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DefaultResponse'
 */
async function unregisterHook(req: NextApiRequest, res: NextApiResponse,
  userId: string
) {
  if (req.method === 'POST') {
    const loopService = new LoopService(userId);
    const body = req.body;
    if (validate(body)) {
      try {
        await loopService.unregisterHook(body.loopId, body.type)
        res.status(200).json({ status: '200', message : 'Webhook unregistered successfully'});
      } catch (error) {
        if(error instanceof ServiceError) {
          res.status(400).json({ status: '400' , message: error.message});
        } else {
          res.status(500).json({ status: '500' , message: "Unexpected Error"});
        }
      }
    } else {
      res.status(400).json({ status: '400', data : validate.errors, message: "Failed to unregister Webhook"});
    }

  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default withAuth(unregisterHook);