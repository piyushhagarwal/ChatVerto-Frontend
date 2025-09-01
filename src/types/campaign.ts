import type { ApiResponse } from './api';

interface TextParameter {
  type: 'text';
  text: string;
}

interface ImageParameter {
  type: 'image';
  image: {
    id: string;
  };
}

interface DocumentParameter {
  type: 'document';
  document: {
    id: string;
    filename?: string;
  };
}

interface VideoParameter {
  type: 'video';
  video: {
    id: string;
  };
}

interface QuickReplyButtonParameter {
  type: 'payload';
  payload: string;
}

interface UrlButtonParameter {
  type: 'text';
  text: string;
}

type MessageParameter =
  | TextParameter
  | ImageParameter
  | DocumentParameter
  | VideoParameter
  | QuickReplyButtonParameter
  | UrlButtonParameter;

interface ComponentObject {
  type: 'header' | 'body' | 'button';
  sub_type?: 'quick_reply' | 'url'; // Required only if the type is "button"
  parameters: MessageParameter[];
  index?: number; // Required only if the type is "button"
}

interface TemplateObject {
  name: string;
  language: {
    code: string;
  };
  components?: ComponentObject[];
}

export interface Campaign {
  id: string;
  name: string;
  groupName: string;
  status: 'Completed' | 'Pending' | 'Failed';
  templateName: string;
  createdAt: Date;
  totalContacts: number;
  failedMessages: number;
  sentMessages: number;
  deliveredMessages: number;
  readMessages: number;
}

export interface CreateCampaignPayload {
  name: string;
  groupId: string;
  templateId: string;
  templateObject: TemplateObject;
}

export interface GetAllCampaignsResponse {
  status: number;
  success: number;
  message: string;
  data: { campaigns: Campaign[] };
}

export type GetCampaignResponseById = ApiResponse<{
  campaign: Campaign;
}>;

export type DeleteCampaignResponse = ApiResponse;
