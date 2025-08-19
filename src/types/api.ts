/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}
