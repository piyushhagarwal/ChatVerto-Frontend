export interface User {
  email: string;
  isWhatsappConnected: boolean;
}

export interface UserResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
