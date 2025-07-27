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
  
  export interface ProfileState {
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
  }