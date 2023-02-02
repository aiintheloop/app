import { ApiTokenService } from '../services/apiTokenService';

export default withAuth

export declare type NextRoute = ((req: any, res: any, userId: string) => Promise<any>);

function withAuth(route : NextRoute) {
  const routeFunction: NextRoute = async function (req: any, res: any): Promise<void> {

    const apiTokenService = new ApiTokenService();
    const apiKey = req.headers["apikey"]
    if(apiKey) {
      let userId;
      try {
        userId = await apiTokenService.getUserIdByAPIToken(apiKey);
      } catch (error) {
        res.status(401).json({ "message": "Invalid ApiKey" });
      }
      if (userId != null) {
        await route(req, res, userId)
      } else {
        res.status(401).json({ "message": "Invalid ApiKey" });
      }
    } else {
        res.status(401).json({});
      }
    }
  return routeFunction;
}
