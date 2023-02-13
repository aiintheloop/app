import { Approval } from './approval';

export interface ApprovalResponse {
  message: string;
  data?: Approval | Approval[];
  status: number;
}