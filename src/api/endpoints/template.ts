import axios from '../axios';

import type {
  CreateTemplateResponse,
  GetAllTemplateResponse,
  GetTemplateResponseById,
  CreateTemplatePayload,
  DeleteTemplateResponse,
} from '@/types/template';

export const getAllTemplates = async (): Promise<GetAllTemplateResponse> => {
  const response = await axios.get<GetAllTemplateResponse>('/templates');
  return response.data;
};

export const getTemplateById = async (
  templateId: string
): Promise<GetTemplateResponseById> => {
  const response = await axios.get<GetTemplateResponseById>(
    `/templates/${templateId}`
  );
  return response.data;
};

export const createTemplate = async (
  payload: CreateTemplatePayload
): Promise<CreateTemplateResponse> => {
  const response = await axios.post<CreateTemplateResponse>(
    '/templates',
    payload
  );
  return response.data;
};

export const deleteTemplate = async (
  templateName: string
): Promise<DeleteTemplateResponse> => {
  const response = await axios.delete<DeleteTemplateResponse>(
    `/templates/${templateName}`
  );
  return response.data;
};
