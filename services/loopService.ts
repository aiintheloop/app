import { BaseService } from './baseService';
import { Loop } from '../types';
import { ServiceError } from './exception/ServiceError';

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

  async registerHook(id: string, type:string, url:string) {
    let response;
    if(type !='acceptHook' && type!='declineHook') {
      throw new ServiceError(`Unknown Hook type '${type}' expect acceptHook or declineHook`)
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
      throw new ServiceError('Failed to register loop');
    }
    console.log(response)
    if (response.error) {
      console.error(`Failed to register hook for loop with id '${id}' with error: ${response.statusText}`);
      throw new ServiceError('Failed to register loop');
    }
    if(response.data.length==0) {
      throw new ServiceError(`Failed to register hook for loop with id with id '${id}'`);
    }
    return response.data;
  }


}