import {
  createServerSupabaseClient,
  withApiAuth
} from '@supabase/auth-helpers-nextjs';
import { Novu, ChatProviderIdEnum } from '@novu/node';
import withExceptionHandler from '@/utils/withExceptionHandler';
import { UnauthorizedException } from '../../services/exception/UnauthorizedException';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { DiscordIntegrationRequest } from '../../models/discordIntegrationRequest';
import { updateUserDiscord } from '@/utils/supabase-admin';

const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<DiscordIntegrationRequest> = {
  type: 'object',
  properties: {
    webhook: { type: 'string', format: 'uri' }
  },
  required: ['webhook'],
  additionalProperties: false
};
const validate = ajv.compile(schema);

/**
 * No public API
 */
export default withExceptionHandler(async function integrateDiscord(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) {
    throw new UnauthorizedException('Could not get user');
  }
  const NOVU_SECRET = process?.env?.NOVU_SECRET ?? '';
  if (req.method === 'POST') {
    const body = req.body;
    if (validate(body)) {
      const novu = new Novu(NOVU_SECRET);
      await novu.subscribers.setCredentials(
        '58700508-dd6b-488f-9881-abb16ac7bba7',
        ChatProviderIdEnum.Discord,
        {
          webhookUrl: body.webhook
        }
      );
      await updateUserDiscord(session.user.id, body.webhook);
      return res.status(200).json({ status: '200', message: 'Webhook added' });
    } else {
      res
        .status(400)
        .json({
          status: '400',
          data: validate.errors,
          message: 'Failed to register discord webhook'
        });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
