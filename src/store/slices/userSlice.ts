/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserProfile, UserProfileResponse } from '@/types/user';
import { fetchUserProfile } from '@/api/endpoints/user';

export interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const getUserProfileThunk = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res: UserProfileResponse = await fetchUserProfile();
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserProfileThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
