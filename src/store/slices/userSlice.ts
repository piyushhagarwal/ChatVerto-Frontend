/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types/user';
import { getUserDetails } from '@/api/endpoints/user';

interface UserState {
  user: User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: { email: '', isWhatsappConnected: false },
  loading: false,
  error: null,
};

// ──────────────────────────────
// 🔁 Thunks
// ──────────────────────────────

export const fetchUserDetailsThunk = createAsyncThunk(
  'user/fetchDetails',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserDetails();
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// ──────────────────────────────
// 🛠️ Slice
// ──────────────────────────────

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetailsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
