import { BaseService } from './baseService';
import { ServiceError } from './exception/ServiceError';
import { Loop } from '../models/loop';
import { User } from '../models/user';


export class NotificationProviderService extends BaseService {
  private _userId: String;

  public constructor(userId: String) {
    super();
    this._userId = userId;
  }

   updateUserDiscord = async (uuid: string, discord: string) => {
    const { error } = await this._supabaseAdmin
      .from('users')
      .update({ discord: discord })
      .eq('id', uuid);
    if (error) throw error;
    console.log(`Updated discord for user ${uuid}.`);
  };

   updateUserTeams = async (uuid: string, teams: string) => {
    const { error } = await this._supabaseAdmin
      .from('users')
      .update({ teams: teams })
      .eq('id', uuid);
    if (error) throw error;
    console.log(`Updated teams for user ${uuid}.`);
  };
}
