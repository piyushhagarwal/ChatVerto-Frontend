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
