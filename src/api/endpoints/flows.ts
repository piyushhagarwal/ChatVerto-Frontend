import axios from '../axios';
import type {
  FlowListResponse,
  FlowResponse,
  CreateFlowPayload,
  UpdateFlowPayload,
  BaseApiResponse,
} from '../../types/flows';

// Create a new flow
export const createFlow = async (
  payload: CreateFlowPayload
): Promise<FlowResponse> => {
  const response = await axios.post<FlowResponse>('/flows', payload);
  return response.data;
};

// Get all flows for the logged-in user
export const getAllFlows = async (): Promise<FlowListResponse> => {
  const response = await axios.get<FlowListResponse>('/flows');
  return response.data;
};

// Get a single flow by ID
export const getSingleFlow = async (flowId: string): Promise<FlowResponse> => {
  const response = await axios.get<FlowResponse>(`/flows/${flowId}`);
  return response.data;
};

// Update a flow by ID
export const updateFlow = async (
  flowId: string,
  payload: UpdateFlowPayload
): Promise<FlowResponse> => {
  const response = await axios.put<FlowResponse>(`/flows/${flowId}`, payload);
  return response.data;
};

// Delete a flow by ID
export const deleteFlow = async (flowId: string): Promise<BaseApiResponse> => {
  const response = await axios.delete<BaseApiResponse>(`/flows/${flowId}`);
  return response.data;
};
