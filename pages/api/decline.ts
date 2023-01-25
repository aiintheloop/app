import { supabase } from '@/utils/supabase-client';

export default async function approve(
  req: any,
  res: any
) {
  if (req.method === 'GET') {
    const approvalId = req.query.id;
    try {
      const approvalResponse = await supabase.from('approvals').update({ approved: false }).eq('ID', approvalId);
      if (approvalResponse.error) {
        console.error(`Failed to set approval to approved with error ${approvalResponse.error}`);
        return res.status(500).json({ status: '500', message: 'Approving failed' });
      } else {
        return res.status(200).json({ status: '200', message: 'Decline' });
      }
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ status: '500', message: 'Approving failed' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
