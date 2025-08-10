/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: (() => void) | undefined;
  }
}

interface FacebookLoginResponse {
  authResponse?: {
    code: string;
    accessToken?: string;
    userID?: string;
    expiresIn?: number;
    signedRequest?: string;
  };
  status?: string;
}

interface WhatsAppSignupMessage {
  type: string;
  data?: any;
}

export type { FacebookLoginResponse, WhatsAppSignupMessage };
