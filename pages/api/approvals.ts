import {  getDataForApproval } from 'utils/supabase-admin';
import WebhookNotifier from '@/utils/WebhookNotifier';

export default async function approve(
  req : any,
  res : any
) {
  if (req.method === 'GET') {
    const approvalId = req.query.id
    try {
      const approvalData = await getDataForApproval(approvalId);
      if(approvalData.error) {
        return res.status(500).json(approvalData.error);
      } else {
        return res.status(200).json(approvalData);
      }
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
