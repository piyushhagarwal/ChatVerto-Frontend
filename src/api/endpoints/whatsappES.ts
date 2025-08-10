import axios from '../axios';
import type {
  EmbeddedSignupPayload,
  EmbeddedSignupResponse,
} from '@/types/whatsAppES';

// 🟢 Create an embedded signup
export const createEmbeddedSignup = async (
  payload: EmbeddedSignupPayload
): Promise<EmbeddedSignupResponse> => {
  const response = await axios.post<EmbeddedSignupResponse>(
    '/embedded-signup',
    payload
  );
  return response.data;
};
