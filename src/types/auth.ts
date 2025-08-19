import type { ApiResponse } from './api';

export interface User {
  email: string;
}

export type AuthResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
