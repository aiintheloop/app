import { BaseService } from './baseService';
import { Approval } from '../models/approval';
import { Novu } from '@novu/node';
import { NotFoundException } from './exception/NotFoundException';
import { ServiceError } from './exception/ServiceError';


/**
 * Class representing a service for managing approvals.
 * @extends BaseService
 */
export class ApprovalService extends BaseService {

  private _userId: string;
  private _novuSecret: string;

  /**
   * Create an instance of the ApprovalService.
   * @param {string} userId - The user ID of the user who owns the approvals.
   * @param {string} novuSecret - The secret for Novu integration.
   */
  public constructor(userId: string, novuSecret: string) {
    super();
    this._userId = userId;
    this._novuSecret = novuSecret;
  }

  /**
   * Delete an approval with the given ID.
   * @param {string} id - The ID of the approval to delete.
   * @returns {Promise<ApprovalResponse>} - A message indicating the status of the delete operation.
   * @throws {NotFoundException} - If the approval with the given ID is not found.
   * @throws {ServiceError} - If there is an error deleting the approval.
   */
  async delete(id: string) {
    let deleteQueryResult;
    try {
      deleteQueryResult = await this._supabaseAdmin.from('approvals')
        .delete()
        .eq('ID', id)
        .eq('user_id', this._userId);
    } catch (e) {
      console.error(`Failed to get Approval with id "${id}" with Reason ${JSON.stringify(e)}`);
      throw new ServiceError(`Failed to get Approval with id "${id}"`);
    }

    if (deleteQueryResult.count === 0) {
      throw new NotFoundException(`Approval with id "${id}" not found`);
    }
    return {
      message: `Approval with id "${id}" deleted successfully`,
      status: 200
    };
  }

  /**
   * Fetch all approvals for the current user.
   * @returns {Promise<Approval[]>} - An array of all approvals belonging to the current user.
   * @throws {ServiceError} - If there is an error fetching the approvals.
   */
  async fetchAll(): Promise<Approval[]> {
    let approvalQueryResult;
    try {
      approvalQueryResult = await this._supabaseAdmin.from('approvals')
        .select('*')
        .eq('user_id', this._userId);
    } catch (e) {
      console.error(`Failed to fetch Approvals with error: ${JSON.stringify(e)}`);
      throw new ServiceError('Failed to fetch approvals');
    }

    if (approvalQueryResult.error) {
      console.error(`Failed to fetch Approvals with error: ${JSON.stringify(approvalQueryResult.error)}`);
      throw new ServiceError('Failed to fetch approvals');
    }

    return approvalQueryResult.data as Approval[];
  }

  /**
   * Create a new approval.
   * @param {Approval} approval - The approval object to create.
   * @returns {Promise<Approval>} - The created approval object.
   * @throws {ServiceError} - If there is an error creating the approval.
   */
  async create(approval: Approval): Promise<Approval> {
    approval.user_id = this._userId;

    let createApprovalQueryResult = await this._supabaseAdmin.from('approvals')
      .insert(approval)
      .select();

    if (createApprovalQueryResult.error) {
      console.error(`Failed to insert Approval with error: ${JSON.stringify(createApprovalQueryResult.error)}`);
      throw new ServiceError('Error creating approval');
    }

    const novu = new Novu(this._novuSecret);
    await novu.trigger('approval', {
      to: {
        subscriberId: this._userId
      },
      payload: {
        approvalID: createApprovalQueryResult.data[0].ID
      }
    });

    return createApprovalQueryResult.data[0] as Approval;
  }

  /**
   * Update an approval with the given ID.
   * @param {string} ID - The ID of the approval to update.
   * @param {Approval} approval - The updated approval object.
   * @returns {Promise<Approval>} - The updated approval object.
   * @throws {ServiceError} - If there is an error updating the approval.
   */
  async update(ID: string, approval: Approval): Promise<Approval> {
    approval.user_id = this._userId;
    let updateQueryResult;
    try {
      updateQueryResult = await this._supabaseAdmin.from('approvals')
        .update(approval)
        .eq('user_id', this._userId)
        .eq('ID', ID)
        .select();
    } catch (e) {
      console.error(`Failed to update Approval with id '${ID}' and error: ${JSON.stringify(e)}`);
      throw new ServiceError(`Failed to update approval with id '${ID}'`);
    }

    if (updateQueryResult.error) {
      console.error(`Failed to update Approval with id '${ID}' and error: ${JSON.stringify(updateQueryResult.error)}`);
      throw new ServiceError(`Failed to update approval with id '${ID}'`);
    }
    return updateQueryResult.data[0] as Approval;
  }

  /**
   * Get an approval by ID.
   * @param {string} ID - The ID of the approval to get.
   * @returns {Promise<Approval>} - The approval object with the given ID.
   * @throws {NotFoundException} - If the approval with the given ID is not found.
   * @throws {ServiceError} - If there is an error fetching the approval.
   */
  async getById(ID: string): Promise<Approval> {
    let approvalQueryResult;
    try {
      approvalQueryResult = await this._supabaseAdmin.from('approvals')
        .select('*')
        .eq('ID', ID)
        .eq('user_id', this._userId)
        .select();
    } catch (e) {
      console.log(`Failed to fetch Approval with id '${ID}' and with error: ${JSON.stringify(e)}`);
      throw new ServiceError(`Failed to fetch Approval with id '${ID}'`);
    }

    if (approvalQueryResult.error) {
      console.log(`Failed to fetch Approval with id '${ID}'and with error: ${JSON.stringify(approvalQueryResult.error)}`);
      throw new ServiceError(`Failed to fetch Approval with id '${ID}'`);
    }

    const approval = approvalQueryResult.data[0] as Approval;

    if (!approval) {
      throw new NotFoundException(`Approval with id "${ID}" not found`);
    }

    return approval;
  }

}