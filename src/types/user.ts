import type { ApiResponse } from './api';

export interface WhatsAppDetails {
  address?: string;
  description?: string;
  vertical?: string;
  about?: string;
  businessEmail?: string;
  websites?: string[];
  profilePictureUrl?: string;
  verifiedName?: string;
  displayPhoneNumber?: string;
}

export interface UserProfile {
  email: string;
  isWhatsappConnected: boolean;
  whatsAppDetails?: WhatsAppDetails;
}

export type UserProfileResponse = ApiResponse<{
  user: UserProfile;
}>;

export interface UpdateUserProfileRequest {
  address?: string;
  description?: string;
  vertical?: string;
  about?: string;
  businessEmail?: string;
  email?: string;
  websites?: string[];
  profile_picture_handle?: string;
}

export type UpdateUserProfileResponse = ApiResponse;

export interface UpdateProfilePictureRequest {
  file: File;
}
