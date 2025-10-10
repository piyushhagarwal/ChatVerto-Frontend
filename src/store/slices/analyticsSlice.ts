import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type {
  SummaryDataResponse,
  ChartDataResponse,
  SummaryStats,
  ChartStats,
} from '@/types/analytics';

import { getSummaryData, getChartData } from '@/api/endpoints/analytics';

interface AnalyticsState {
  summary: SummaryStats | null;
  chart: ChartStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  summary: null,
  chart: null,
  loading: false,
  error: null,
};

export const fetchSummaryDataThunk = createAsyncThunk(
  'analytics/fetchSummary',
  async (period: string, { rejectWithValue }) => {
    try {
      const res: SummaryDataResponse = await getSummaryData(period);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch summary data'
      );
    }
  }
);

export const fetchChartDataThunk = createAsyncThunk(
  'analytics/fetchChart',
  async (
    { period, type }: { period: string; type: string },
    { rejectWithValue }
  ) => {
    try {
      const res: ChartDataResponse = await getChartData(period, type);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch chart data'
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSummaryDataThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummaryDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload ?? null;
      })
      .addCase(fetchSummaryDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChartDataThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chart = action.payload ?? null;
      })
      .addCase(fetchChartDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analyticsSlice.reducer;
