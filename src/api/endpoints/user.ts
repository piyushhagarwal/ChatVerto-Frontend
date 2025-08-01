import axios from '../axios';
import { type UserProfileResponse } from '@/types/user';

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  console.log('Fetching user profile from API');
  const response = await axios.get<UserProfileResponse>('/user');
  return response.data;
};

// export const updateUserProfile = async (data: Partial<UserProfileResponse>) => {
//   await axios.put('/user', data);
// };

// export const uploadProfilePic = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   await axios.post('/user/upload-picture', formData);
// };
