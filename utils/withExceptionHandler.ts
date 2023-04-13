import { ApiTokenService } from '../services/apiTokenService';
import { NotFoundException } from '../services/exception/NotFoundException';
import { ServiceError } from '../services/exception/ServiceError';
import { UnauthorizedException } from '../services/exception/UnauthorizedException';

export default withExceptionHandler

export declare type NextRoute = ((req: any, res: any) => Promise<any>);

function withExceptionHandler(route : NextRoute) {
  const handleErrors: NextRoute = async function (req: any, res: any): Promise<void> {
    try {
      await route(req, res)
    } catch (e) {
      console.error(JSON.stringify(e))
      if(e instanceof NotFoundException) {
        return res.status(404).json({message: e.message, status : 404})
      } else if (e instanceof ServiceError) {
        return res.status(500).json({message: e.message, status : 500})
      } else if(e instanceof UnauthorizedException) {
        return res.status(401).json({message: e.message, status : 401})
      }
      return res.status(500).json({message: JSON.stringify(e), status : 500})
    }
  }
  return handleErrors;
}
