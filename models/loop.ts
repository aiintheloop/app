export interface Loop {
  afterLoopHook?: string | null
  beforeLoopHook?: string | null
  created_at?: string | null
  description?: string | null
  hook?: boolean | null
  ident: string
  name?: string | null
  tool?: string | null
  type?: string | null
}