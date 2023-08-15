import { BaseService } from './baseService';
import { ServiceError } from './exception/ServiceError';
import { Loop } from '../models/loop';


export class UserService extends BaseService {
  private _userId: String;

  public constructor(userId: String) {
    super();
    this._userId = userId;
  }

  async getLoop(id : String): Promise<Loop | null> {
    let response;
    try {
      response = await this._supabaseAdmin
        .from('loops')
        .select('*')
        .eq('loop_id', id)
        .eq('user_id', this._userId);
    } catch (error) {
      console.error(`Failed to fetch Loop with error: ${error}`);
      throw new ServiceError(`Failed to fetch loop with id ${id}`);
    }
    if (response.error) {
      console.error(
        `Failed to fetch loops with message: ${response.statusText}`
      );
      throw new ServiceError(`Failed to fetch loop with id ${id}`);
    }
    return response.data[0];
  }
}
