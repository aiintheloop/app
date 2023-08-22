import { Json } from 'types_db';

export interface Approval {
  approved: boolean | null;
  content: string | null;
  created_at: string | null;
  ID: string;
  approval_uri: string | null,
  loop_id: string | null;
  user_id: string;
  prompts?: Array<Record<string, string>> | null;
  type: string | null;
}
