import { BaseService } from './baseService';
import { ApprovalResponse } from '../models/approvalResponse';
import { Approval } from '../models/approval';
import { Novu } from '@novu/node';

export class ApprovalService extends BaseService {



  private _userId: string;

  public constructor(userId: string) {
    super();
    this._userId = userId;
  }

  async delete(id: string): Promise<ApprovalResponse> {
    try {
      const result = await this._supabaseAdmin.from('approvals')
        .delete()
        .eq('ID', id)
        .eq('user_id', this._userId)

      if (result.count === 0) {
        return {
          message: `Approval with id "${id}" not found`,
          status: 404,
        };
      }
      return {
        message: `Approval with id "${id}" deleted successfully`,
        status: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error deleting approval',
        status: 500,
      };
    }
  }

  async fetchAll(): Promise<ApprovalResponse> {
    try {
      const result = await this._supabaseAdmin.from('approvals')
        .select('*')
        .eq('user_id', this._userId)

      if (result.error) {
        console.log(`Failed to fetch Approvals with error: ${result.error}`)
        return {
          message: 'Error fetching approvals',
          status: 500,
        };
      }

      return {
        message: 'Approvals fetched successfully',
        data: result.data as Approval[],
        status: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error fetching approvals',
        status: 500,
      };
    }
  }

  async create(approval: Approval): Promise<ApprovalResponse> {
    try {
      approval.user_id = this._userId;

      const result = await this._supabaseAdmin.from('approvals')
        .insert(approval)
        .select()

      if (result.error) {
        console.log(`Failed to insert Approval with error: ${JSON.stringify(result.error)}`)
        return {
          message: 'Error creating approval',
          status: result.status,
        };
      }


      const novu = new Novu("1d09c211bd7b49867e3a31500e0776d4");
      await novu.trigger('approval', {
        to: {
          subscriberId: this._userId,
        },
        payload: {
          approvalID: result.data[0].ID,
        },
      });

      return {
        message: 'Approval created successfully',
        data: result.data[0] as Approval,
        status: 201,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error creating approval',
        status: 500,
      };
    }
  }

  async update(ID: string, approval: Approval): Promise<ApprovalResponse> {
    try {
      approval.user_id = this._userId;

      const result = await this._supabaseAdmin.from('approvals')
        .update(approval)
        .eq('user_id', this._userId)
        .eq('ID', ID)
        .select()

      if (result.error) {
        return {
          message: 'Error updating approval',
          status: result.status,
        };
      }

      return {
        message: 'Approval updated successfully',
        data: result.data[0] as Approval,
        status: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error updating approval',
        status: 500,
      };
    }
  }

  async getById(ID: string): Promise<ApprovalResponse> {
    try {
      const result = await this._supabaseAdmin.from('approvals')
        .select('*')
        .eq('ID', ID)
        .eq('user_id', this._userId)
        .select();

      if (result.error) {
        console.log(`Failed to get Approval with error: ${result.error}`)
        return {
          message: 'Error fetching approval',
          status: result.status,
        };
      }

      return {
        message: 'Approval fetched successfully',
        data: result.data[0] as Approval,
        status: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error fetching approval',
        status: 500,
      };
    }
  }

}