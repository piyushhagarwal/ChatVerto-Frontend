import axios from '../axios';

import type {
  Campaign,
  CreateCampaignPayload,
  GetAllCampaignsResponse,
  GetCampaignResponseById,
  DeleteCampaignResponse,
} from '@/types/campaign';

export const getAllCampaigns = async (): Promise<GetAllCampaignsResponse> => {
  const response = await axios.get<GetAllCampaignsResponse>('/campaigns');
  return response.data;
};

export const getCampaignById = async (
  campaignId: string
): Promise<GetCampaignResponseById> => {
  const response = await axios.get<GetCampaignResponseById>(
    `/campaigns/${campaignId}`
  );
  return response.data;
};

export const createCampaign = async (
  payload: CreateCampaignPayload
): Promise<Campaign> => {
  const response = await axios.post<Campaign>('/campaigns', payload);
  return response.data;
};

export const deleteCampaign = async (
  campaignId: string
): Promise<DeleteCampaignResponse> => {
  const response = await axios.delete<DeleteCampaignResponse>(
    `/campaigns/${campaignId}`
  );
  return response.data;
};
