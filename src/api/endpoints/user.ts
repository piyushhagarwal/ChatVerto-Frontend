import axios from '../axios';
import type { UserResponse } from '@/types/user';

// 🟢 Get user details
export const getUserDetails = async (): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>('/user');
  return response.data;
};
