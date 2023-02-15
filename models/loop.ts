export interface Loop {
  ident: string;
  created_at: string;
  name: string;
  user_id: string;
  tool: string;
  type: string;
  hook?: boolean | null;
  description: string;
  acceptHook?: string | null;
  declineHook?: string | null;
}
