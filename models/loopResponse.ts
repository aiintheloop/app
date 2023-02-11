import { Loop } from './loop';

export interface LoopResponse {
  /**
   * @example Some Message
   * @example Some Other Message
   */
  message: string
  data: Loop
  /**
   * @example 200
   * @example 400
   */
  status: number
}