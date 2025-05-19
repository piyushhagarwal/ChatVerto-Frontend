import axios from "../axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../../types/auth";

// Function to handle user login
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

// Function to handle user registration
const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    "/auth/register",
    credentials
  );
  return response.data;
};

export { login, register };
