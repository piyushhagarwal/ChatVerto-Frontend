export interface EmbeddedSignupPayload {
  shortLivedToken: string;
  phoneNumberId: string;
  wabaId: string;
}

export interface EmbeddedSignupResponse {
  status: number;
  success: boolean;
  message: string;
}
