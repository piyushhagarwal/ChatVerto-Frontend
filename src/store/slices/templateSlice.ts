/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type {
  CreateTemplateResponse,
  GetAllTemplateResponse,
  GetTemplateResponseById,
  DeleteTemplateResponse,
  CreateTemplatePayload,
  Template,
} from '@/types/template';

import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  deleteTemplate,
} from '@/api/endpoints/template';

interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
};

export const fetchAllTemplatesThunk = createAsyncThunk(
  'templates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res: GetAllTemplateResponse = await getAllTemplates();
      return res.data.templates;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch templates'
      );
    }
  }
);

export const fetchTemplateByIdThunk = createAsyncThunk(
  'templates/fetchTemplateById',
  async (templateId: string, { rejectWithValue }) => {
    try {
      const res: GetTemplateResponseById = await getTemplateById(templateId);
      return res.data?.template;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch templates'
      );
    }
  }
);

export const deleteTemplateThunk = createAsyncThunk(
  'template/delete',
  async (templateName: string, { rejectWithValue }) => {
    try {
      await deleteTemplate(templateName);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete contact'
      );
    }
  }
);

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllTemplatesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllTemplatesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })

      .addCase(fetchAllTemplatesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTemplateByIdThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTemplateByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTemplate = action.payload ?? null;
      })

      .addCase(fetchTemplateByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteTemplateThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteTemplateThunk.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(deleteTemplateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default templateSlice.reducer;
