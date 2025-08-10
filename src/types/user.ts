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

export interface UserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

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

export interface UpdateUserProfileResponse {
  status: number;
  success: boolean;
  message?: string;
  data?: any;
}

export interface UpdateProfilePictureRequest {
  file: File;
}
