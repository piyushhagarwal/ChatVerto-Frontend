import type { ApiResponse } from './api';

export interface Growth {
  checkins: number;
  uniqueCustomers: number;
  repeatedCustomers: number;
}

export interface SummaryStats {
  totalCheckins: number;
  uniqueCustomers: number;
  repeatedCustomers: number;
  growth: Growth;
}

export interface ChartDataPoint {
  label: string;
  count: number;
}

export interface ChartStats {
  type: string;
  period: string;
  chartData: ChartDataPoint[];
}

export interface SummaryDataResponse extends ApiResponse<SummaryStats> {}

export interface ChartDataResponse extends ApiResponse<ChartStats> {}
