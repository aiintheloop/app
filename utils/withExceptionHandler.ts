import { ApiTokenService } from '../services/apiTokenService';
import { NotFoundException } from '../services/exception/NotFoundException';
import { ServiceError } from '../services/exception/ServiceError';

export default withExceptionHandler

export declare type NextRoute = ((req: any, res: any) => Promise<any>);

function withExceptionHandler(route : NextRoute) {
  const handleErrors: NextRoute = async function (req: any, res: any): Promise<void> {
    try {
      await route(req, res)
    } catch (e) {
      if(e instanceof NotFoundException) {
        return res.status(404).json({message: e.message, status : 404})
      } else if (e instanceof ServiceError) {
        return res.status(500).json({message: e.message, status : 500})
      }
      return res.status(500).json({message: 'Unexpected Error', status : 500})
    }
  }
  return handleErrors;
}
