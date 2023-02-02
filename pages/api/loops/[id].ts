import withAuth from '@/utils/withAuth';

//Todo
async function registerHook(
  req: any,
  res: any,
  userId: string
) {
  if (req.method === 'POST') {
    //const loopService = new LoopService(userId);
    const { id } = req.query
    res.status(200).end(id);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
  if (req.method === 'POST') {

  }
};

export default withAuth(registerHook);