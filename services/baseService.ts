import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types_db';

export abstract class BaseService {

  protected _supabaseAdmin: SupabaseClient<Database>

  protected constructor() {
    this._supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );


  }

}
