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
import { TeamsIntegrationRequest } from '../../models/teamsIntegrationRequest';
import { updateUserTeams } from '@/utils/supabase-admin';
const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<TeamsIntegrationRequest> = {
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
export default withExceptionHandler(async function createCheckoutSession(
  req,
  res
) {
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
        session.user.id,
        ChatProviderIdEnum.MsTeams,
        {
          webhookUrl: body.webhook
        }
      );
      await updateUserTeams(session.user.id, body.webhook);
      return res.status(200).json({ status: '200', message: 'Webhook added' });
    } else {
      res
        .status(400)
        .json({
          status: '400',
          data: validate.errors,
          message: 'Failed to register teams webhook'
        });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
