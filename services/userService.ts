import { BaseService } from './baseService';
import { ServiceError } from './exception/ServiceError';
import { Loop } from '../models/loop';
import { User } from '../models/user';


export class UserService extends BaseService {
  private _userId: String;

  public constructor(userId: String) {
    super();
    this._userId = userId;
  }

  async getUser(): Promise<User | null> {
    let response;
    try {
      response = await this._supabaseAdmin
        .from('users')
        .select('id,init,email')
        .eq('id', this._userId);
    } catch (error) {
      console.error(`Failed to fetch user with error: ${error}`);
      throw new ServiceError(`Failed to fetch user with id ${this._userId}`);
    }
    if (response.error) {
      console.error(
        `Failed to fetch user with message: ${response.statusText}`
      );
      throw new ServiceError(`Failed to fetch user with id ${this._userId}`);
    }
    if(response.data.length < 1) {
      throw new ServiceError(`Failed to fetch user with id ${this._userId}`);
    }
    return {"init" : response.data[0].init, "email" : response.data[0].email} as User;
  }
}
