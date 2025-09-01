import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type {
  Campaign,
  CreateCampaignPayload,
  GetAllCampaignsResponse,
  GetCampaignResponseById,
  DeleteCampaignResponse,
} from '@/types/campaign';

import {
  getAllCampaigns,
  getCampaignById,
  deleteCampaign,
} from '@/api/endpoints/campiagn';

interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

export const fetchAllCampaignsThunk = createAsyncThunk(
  'campaigns/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res: GetAllCampaignsResponse = await getAllCampaigns();
      console.log('Fetched campaigns:', res.data.campaigns);
      return res.data.campaigns;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch campaigns'
      );
    }
  }
);

export const fetchCampaignByIdThunk = createAsyncThunk(
  'campaigns/fetchCampaignById',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const res: GetCampaignResponseById = await getCampaignById(campaignId);
      return res.data?.campaign;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch campaign'
      );
    }
  }
);

export const deleteCampaignThunk = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      await deleteCampaign(campaignId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete campaign'
      );
    }
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllCampaignsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCampaignsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchAllCampaignsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCampaignByIdThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload ?? null;
      })
      .addCase(fetchCampaignByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCampaignThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaignThunk.fulfilled, (state, action) => {
        state.loading = false;
        // // Optionally, remove the deleted campaign from the campaigns array
        // if (action.meta.arg) {
        //   state.campaigns = state.campaigns.filter(
        //     (campaign) => campaign.id !== action.meta.arg
        //   );
        // }
      })
      .addCase(deleteCampaignThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default campaignSlice.reducer;
