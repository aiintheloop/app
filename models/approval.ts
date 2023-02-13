export interface Approval {
  approved: boolean | null;
  content: string | null;
  created_at: string | null;
  ID: string;
  loop_id: string | null;
  user_id: string | null;
}