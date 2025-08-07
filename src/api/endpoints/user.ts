import axios from '../axios';
import { type UserProfileResponse} from '@/types/user';
import { type UpdateUserProfileResponse, type UpdateUserProfileRequest } from "@/types/user";
import { type UpdateProfilePictureRequest } from "@/types/user";

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  console.log('Fetching user profile from API');
  const response = await axios.get<UserProfileResponse>('/user');
  return response.data;
};

export const updateUserProfile = async (
  payload: UpdateUserProfileRequest
): Promise<UpdateUserProfileResponse> => {
  const response = await axios.put<UpdateUserProfileResponse>(
    "/user",
    payload
  );
  return response.data;
};


export const updateProfilePicture = async (
  data: UpdateProfilePictureRequest
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await axios.post("/user/upload-profile-pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.message;
};
