import { BaseService } from './baseService';
import { Approval } from '../models/approval';
import { Novu } from '@novu/node';
import { NotFoundException } from './exception/NotFoundException';
import { ServiceError } from './exception/ServiceError';
import { Hook } from '../models/hook';


/**
 * Class representing a service for managing approvals.
 * @extends BaseService
 */
export class HookService extends BaseService {

  private _userId: string;

  /**
   * Create an instance of the HookService.
   * @param {string} userId - The user ID of the user who owns the approvals.
   * @param {string} novuSecret - The secret for Novu integration.
   */
  public constructor(userId: string) {
    super();
    this._userId = userId;
  }


  /**
   * Fetch all hooks for the current user.
   * @returns {Promise<Hook[]>} - An array of all approvals belonging to the current user.
   * @throws {ServiceError} - If there is an error fetching the approvals.
   */
  async fetchAll(type: String): Promise<any[]> {
    let hookQueryResult;
    try {
      if(!type) {
        hookQueryResult = await this._supabaseAdmin.from('webhooks')
          .select('*')
          .eq('user_id', this._userId);
      } else {
        hookQueryResult = await this._supabaseAdmin.from('webhooks')
          .select('*')
          .eq('user_id', this._userId)
          .eq('type', type);
      }
    } catch (e) {
      console.error(`Failed to fetch Hooks with error: ${JSON.stringify(e)}`);
      throw new ServiceError('Failed to fetch hooks');
    }

    if (hookQueryResult.error) {
      console.error(`Failed to fetch Hooks with error: ${JSON.stringify(hookQueryResult.error)}`);
      throw new ServiceError('Failed to fetch hooks');
    }
    return hookQueryResult.data;
  }

}