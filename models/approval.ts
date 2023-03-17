import { Json } from 'types_db';

export interface Approval {
  approved: boolean | null;
  content: string | null;
  created_at: string | null;
  ID: string;
  loop_id: string | null;
  user_id: string;
  prompt: string | null;
  type: string | null;
}
