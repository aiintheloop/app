import { BaseService } from './baseService';
import { ServiceError } from './exception/ServiceError';

export class ApiTokenService extends BaseService {

  public constructor() {
    super()
  }

  /**
   * Retrieves the user ID associated with the given API token.
   * @param apiKey The API token to validate.
   * @returns The user ID if the token is valid, otherwise null.
   * @throws {ServiceError} If an error occurs during the retrieval.
   */
  async getUserIdByAPIToken(apiKey : string) : Promise<string | null> {
    let response;
    try {
      response = await this._supabaseAdmin.from("users").select('id').eq('api_key', apiKey).single();
    } catch(error) {
      console.log(error)
      console.error(`Failed to fetch loops with error: ${error}`)
      throw new ServiceError("Failed to fetch loops");
    }
    console.log(response)
    if(response.status !== 200) {
      console.error(`Failed to fetch loops with message: ${response.statusText}`)
      throw new ServiceError("Failed to fetch loops");
    }
    return response.data?.id || null;
  }


}