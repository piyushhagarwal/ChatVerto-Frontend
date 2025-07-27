import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type ProfileState, type UserProfile } from "@/types/profile"
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePic
} from "@/api/endpoints/profile"

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null
};

export const getUserProfileThunk = createAsyncThunk(
  "profile/fetch",
  async (_, thunkAPI) => {
    try {
      return await fetchUserProfile();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "profile/update",
  async (data: Partial<UserProfile["whatsAppDetails"]>, thunkAPI) => {
    try {
      await updateUserProfile(data);
      return data; // used for optimistic update if needed
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const uploadProfilePicThunk = createAsyncThunk(
  "profile/uploadPic",
  async (file: File, thunkAPI) => {
    try {
      await uploadProfilePic(file);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileThunk.pending, (state) => {
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
  }
});

export default profileSlice.reducer;