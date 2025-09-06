/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UploadMediaResponse } from '@/types/media';
import { uploadMedia } from '@/api/endpoints/media';

interface MediaState {
  mediaId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  mediaId: null,
  loading: false,
  error: null,
};

export const uploadMediaThunk = createAsyncThunk(
  'media/upload',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res: UploadMediaResponse = await uploadMedia(formData);
      return res.data?.mediaId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to upload media'
      );
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMediaState(state) {
      state.mediaId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(uploadMediaThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMediaThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaId =
          typeof action.payload === 'string' ? action.payload : null;
      })
      .addCase(uploadMediaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;
