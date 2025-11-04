import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  UserProfile,
  UserProfileResponse,
  UpdateUserProfileRequest,
  UpdateProfilePictureRequest,
} from '@/types/user';
import {
  fetchUserProfile,
  updateUserProfile,
  updateProfilePicture,
} from '@/api/endpoints/user';

export interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateError: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

// 1. Fetch user profile
export const getUserProfileThunk = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res: UserProfileResponse = await fetchUserProfile();
      return res.data?.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

// 2. Update user profile
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: UpdateUserProfileRequest, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(profileData);
      return response.message; // Optional: could return full response if needed
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update user profile'
      );
    }
  }
);

// 3. Update profile picture
export const updateProfilePictureThunk = createAsyncThunk<
  string, // return type
  UpdateProfilePictureRequest, // argument type
  { rejectValue: string }
>('user/updateProfilePicture', async (data, { rejectWithValue }) => {
  try {
    const response = await updateProfilePicture(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to update profile picture'
    );
  }
});

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUpdateStatus(state) {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Profile
      .addCase(getUserProfileThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || null;
      })
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateUserProfileThunk.pending, state => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, state => {
        state.updateStatus = 'succeeded';
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      })

      // Update Profile Picture
      .addCase(updateProfilePictureThunk.pending, state => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateProfilePictureThunk.fulfilled, state => {
        state.updateStatus = 'succeeded';
      })
      .addCase(updateProfilePictureThunk.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });
  },
});

export const { resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
