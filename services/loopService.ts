import { BaseService } from './baseService';
import { ServiceError } from './exception/ServiceError';
import { Loop } from '../models/loop';

export class LoopService extends BaseService {

  private _userId: String;

  public constructor(userId: String) {
    super();
    this._userId = userId;
  }

  async getAllLoops(): Promise<Array<Loop> | null> {
    let response;
    try {
      response = await this._supabaseAdmin.from('loops').select('*').eq('user_id', this._userId);
    } catch (error) {
      console.error(`Failed to fetch loops with error: ${error}`);
      throw new ServiceError('Failed to fetch loops');
    }
    if (response.error) {
      console.error(`Failed to fetch loops with message: ${response.statusText}`);
      throw new ServiceError('Failed to fetch loops');
    }

    return response.data;
  }


  async unregisterHook(id: string, type:string) {
    let response;
    if(type !='acceptHook' && type!='declineHook') {
      throw new ServiceError(`Unknown Hook type '${type}' expect acceptHook or declineHook`)
    }

    const getCurrentState = await this._supabaseAdmin.from('loops')
      .select('declineHook,acceptHook')
      .eq('ident', id).eq('user_id', this._userId)
      .select().single()

    if(getCurrentState.error) {
      console.error(`Failed to register hook for loop with id '${id}' with error: ${getCurrentState.error}`);
      throw new ServiceError('Failed to register loop');
    }
    if(!getCurrentState.data) {
      throw new ServiceError(`Failed to find loop with id \'${id}\'`);
    }

    if(getCurrentState.data.afterLoopHook==null && type=='acceptHook') {
      throw new ServiceError(`Accept Hook not registered for loop with id \'${id}\' register the hook before`);
    }

    if(getCurrentState.data.beforeLoopHook==null && type=='declineHook') {
      throw new ServiceError(`Decline Hook not registered for loop with id \'${id}\' register the hook before`);
    }

    try {
      if(type=='acceptHook') {
        response = await this._supabaseAdmin.from('loops')
          .update({ afterLoopHook : null })
          .eq('ident', id).eq('user_id', this._userId)
          .select()

      } else {
        response = await this._supabaseAdmin.from('loops')
          .update({ beforeLoopHook: null })
          .eq('ident', id).eq('user_id', this._userId)
          .select()
      }
    } catch (error) {
      console.error(`Failed to unregister hook for loop with id '${id}' with error: ${error}`);
      throw new ServiceError('Failed to unregister hook');
    }
    console.log(response)
    if (response.error) {
      console.error(`Failed to register hook for loop with id '${id}' with error: ${response.statusText}`);
      throw new ServiceError('Failed to unregister hook');
    }
    if(response.data.length==0) {
      throw new ServiceError(`Failed to register hook for loop with id with id '${id}'`);
    }
    return response.data;
  }

  async registerHook(id: string, type:string, url:string) {
    let response;
    if(type !='acceptHook' && type!='declineHook') {
      throw new ServiceError(`Unknown Hook type '${type}' expect acceptHook or declineHook`)
    }

    const getCurrentState = await this._supabaseAdmin.from('loops')
      .select('declineHook,acceptHook')
      .eq('ident', id).eq('user_id', this._userId)
      .select().single()

    if(getCurrentState.error) {
      console.error(`Failed to unregister hook for loop with id '${id}' with error: ${getCurrentState.error}`);
      throw new ServiceError('Failed to unregister loop');
    }
    if(!getCurrentState.data) {
      throw new ServiceError(`Failed to find loop with id \'${id}\'`);
    }


    if(getCurrentState.data.afterLoopHook!=null && type=='acceptHook') {
      throw new ServiceError(`Accept Hook already registered for loop with id \'${id}\' unregister the hook before`);
    }

    if(getCurrentState.data.beforeLoopHook!=null && type=='declineHook') {
      throw new ServiceError(`Decline Hook already registered for loop with id \'${id}\' unregister the hook before`);
    }


    try {
      if(type=='acceptHook') {
        response = await this._supabaseAdmin.from('loops')
          .update({ afterLoopHook : url })
          .eq('ident', id).eq('user_id', this._userId)
          .select()

      } else {
        response = await this._supabaseAdmin.from('loops')
          .update({ beforeLoopHook: url })
          .eq('ident', id).eq('user_id', this._userId)
          .select()
      }
    } catch (error) {
      console.error(`Failed to register hook for loop with id '${id}' with error: ${error}`);
      throw new ServiceError('Failed to register hook');
    }
    console.log(response)
    if (response.error) {
      console.error(`Failed to register hook for loop with id '${id}' with error: ${response.statusText}`);
      throw new ServiceError('Failed to register hook');
    }
    if(response.data.length==0) {
      throw new ServiceError(`Failed to register hook for loop with id with id '${id}'`);
    }
    return response.data;
  }


}