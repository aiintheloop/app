import { BaseService } from './baseService';
import { ApprovalResponse } from '../models/approvalResponse';
import { Approval } from '../models/approval';
import { Novu } from '@novu/node';
import { NotFoundException } from './exception/NotFoundException';
import { ServiceError } from './exception/ServiceError';


// Better Error Handling
export class ApprovalService extends BaseService {

  private _userId: string;
  private _novuSecret: string;

  public constructor(userId: string, novuSecret : string) {
    super();
    this._userId = userId;
    this._novuSecret = novuSecret;
  }

  async delete(id: string) {
      let result;
      try {
        result = await this._supabaseAdmin.from('approvals')
          .delete()
          .eq('ID', id)
          .eq('user_id', this._userId)
      } catch (e) {
          console.error(`Failed to get Approval with id "${id}" with Reasion ${JSON.stringify(e)}`)
          throw new ServiceError(`Failed to get Approval with id "${id}"`)
      }

      if (result.count === 0) {
        throw new NotFoundException(`Approval with id "${id}" not found`)
      }
      return {
        message: `Approval with id "${id}" deleted successfully`,
        status: 200,
      };
  }

  async fetchAll(): Promise<Approval[]> {
    let result;
    try {
      result = await this._supabaseAdmin.from('approvalsd')
        .select('*')
        .eq('user_id', this._userId)
    } catch(e) {
      console.error(`Failed to fetch Approvals with error: ${JSON.stringify(e)}`)
      throw new ServiceError('Failed to fetch approvals')
    }

      if (result.error) {
        console.error(`Failed to fetch Approvals with error: ${JSON.stringify(result.error)}`)
        throw new ServiceError('Failed to fetch approvals')
      }

    return result.data as Approval[]
  }

  async create(approval: Approval): Promise<Approval> {
      approval.user_id = this._userId;

      let result = await this._supabaseAdmin.from('approvals')
        .insert(approval)
        .select()

      if (result.error) {
        console.error(`Failed to insert Approval with error: ${JSON.stringify(result.error)}`)
        throw new ServiceError('Error creating approval')
      }

      const novu = new Novu(this._novuSecret);
      await novu.trigger('approval', {
        to: {
          subscriberId: this._userId,
        },
        payload: {
          approvalID: result.data[0].ID,
        },
      });

      return result.data[0] as Approval;
    }

  async update(ID: string, approval: Approval): Promise<Approval> {
      approval.user_id = this._userId;
      let result;
      try {
         result = await this._supabaseAdmin.from('approvals')
          .update(approval)
          .eq('user_id', this._userId)
          .eq('ID', ID)
          .select()
      } catch (e) {
        console.error(`Failed to update Approval with id '${ID}' and error: ${JSON.stringify(e)}`)
        throw new ServiceError(`Failed to update approval with id '${ID}'`)
      }

      if (result.error) {
        console.error(`Failed to update Approval with id '${ID}' and error: ${JSON.stringify(result.error)}`)
        throw new ServiceError(`Failed to update approval with id '${ID}'`)
      }
      return result.data[0] as Approval;
  }

  async getById(ID: string): Promise<Approval> {
    let result;
    try {
        result = await this._supabaseAdmin.from('approvals')
        .select('*')
        .eq('ID', ID)
        .eq('user_id', this._userId)
        .select();

    } catch (e) {
      console.log(`Failed to fetch Approval with id '${ID}' and with error: ${JSON.stringify(e)}`)
      throw new ServiceError(`Failed to fetch Approval with id '${ID}'`)
    }

      if (result.error) {
        console.log(`Failed to fetch Approval with id '${ID}'and with error: ${JSON.stringify(result.error)}`)
        throw new ServiceError(`Failed to fetch Approval with id '${ID}'`)
      }

      return result.data[0] as Approval;
  }

}