import type { ApiResponse } from './api';

type ComponentType = 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';

export type HeaderFormat = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION';

export type ButtonType =
  | 'QUICK_REPLY'
  | 'URL'
  | 'PHONE_NUMBER'
  | 'OTP'
  | 'MPM'
  | 'CATALOG'
  | 'FLOW'
  | 'VOICE_CALL';

interface TextParameter {
  type: 'TEXT';
  text: string;
}

interface CurrencyParameter {
  type: 'CURRENCY';
  currency: {
    fallback_value: string;
    code: string;
    amount_1000: number;
  };
}

interface DateTimeParameter {
  type: 'DATETIME';
  datetime: {
    fallback_value: string;
  };
}

type ComponentParameter = TextParameter | CurrencyParameter | DateTimeParameter;

export interface Template {
  id: string;
  name: string;
  language?: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  rejected_reason: string;
  components?: Component[];
}

export interface Button {
  type: ButtonType;
  text: string;
  url?: string;
  phone_number?: string;
  example?: {
    header_text?: string[];
    body_text?: string[];
    url?: string[];
  };
}

export interface Component {
  type: ComponentType;
  format?: string; // for header: TEXT, IMAGE, DOCUMENT, VIDEO
  text?: string; // for body/header/footer
  buttons?: Button[];
  example?: {
    header_text?: string[];
    header_handle?: string[]; //This is used for media in header
    body_text?: string[][];
    footer_text?: string[];
    button_text?: string[];
  };
  parameters?: ComponentParameter[];
  sub_type?: 'QUICK_REPLY' | 'URL';
  index?: number;
}

export interface CreateTemplatePayload {
  name: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  language: string;
  parameter_format?: 'NAMED' | 'POSITIONAL';
  components: Component[];
}

export interface GetAllTemplateResponse {
  status: number;
  success: number;
  message: string;
  data: {
    templates: Template[];
  };
}

export type GetTemplateResponseById = ApiResponse<{
  template: Template;
}>;

export type CreateTemplateResponse = ApiResponse;

export type DeleteTemplateResponse = ApiResponse;
