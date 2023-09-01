import withAuth from '@/utils/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../services/userService';
import withExceptionHandler from '@/utils/withExceptionHandler';


/**
 * @swagger
 * /api/auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Check if api key valid
 *     responses:
 *       200:
 *         description: If API Key is valid
 */
const auth = async (req: NextApiRequest, res: NextApiResponse,
                    userId: string) => {
  const userService = new UserService(userId);
  const user = await userService.getUser();
  if (user) {
    res.status(200).json({
      'message': 'Authenticated',
      'data': {
        'user': {
          'email': user.email
        }
      },
      'status': 200
    });
  } else {
    res.status(500).json({
      'message': 'Failed to fetch user data',
      'status': 500
    });
  }
}

export default withExceptionHandler(withAuth(auth));