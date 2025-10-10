import axios from '../axios';

import type { SummaryDataResponse, ChartDataResponse } from '@/types/analytics';

export const getSummaryData = async (
  period: string
): Promise<SummaryDataResponse> => {
  const response = await axios.get<SummaryDataResponse>(
    `/analytics/summary?period=${period}`
  );
  return response.data;
};

export const getChartData = async (
  period: string,
  type: string
): Promise<ChartDataResponse> => {
  const response = await axios.get<ChartDataResponse>(
    `/analytics/chart?period=${period}&type=${type}`
  );
  return response.data;
};
