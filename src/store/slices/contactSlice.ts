/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Contact,
  ContactListResponse,
  ContactResponse,
  CreateSingleContactPayload,
  UpdateContactPayload,
  ImportContactsResponse,
  PaginationInfo,
  ContactQueryParams,
} from '@/types/contact';
import {
  createContact,
  getContactsByGroupId,
  deleteContact,
  getAllContacts,
  updateContact,
  removeContactFromGroup,
  importContactsFromCSV,
} from '@/api/endpoints/contact';

interface ContactState {
  contacts: Contact[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  pagination: null,
  loading: false,
  error: null,
};

// ──────────────────────────────
// 🔁 Thunks
// ──────────────────────────────

export const fetchAllContactsThunk = createAsyncThunk(
  'contact/fetchAll',
  async (params: ContactQueryParams = {}, { rejectWithValue }) => {
    try {
      const res: ContactListResponse = await getAllContacts(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch contacts'
      );
    }
  }
);

export const fetchContactsByGroupIdThunk = createAsyncThunk(
  'contact/fetchByGroupId',
  async (
    { groupId, params = {} }: { groupId: string; params?: ContactQueryParams },
    { rejectWithValue }
  ) => {
    try {
      const res: ContactListResponse = await getContactsByGroupId(
        groupId,
        params
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch contacts'
      );
    }
  }
);

export const createContactThunk = createAsyncThunk(
  'contact/create',
  async (payload: CreateSingleContactPayload, { rejectWithValue }) => {
    try {
      const res: ContactResponse = await createContact(payload);
      return res.data.contact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create contact'
      );
    }
  }
);

export const updateContactThunk = createAsyncThunk(
  'contact/update',
  async (
    {
      contactId,
      payload,
    }: { contactId: string; payload: UpdateContactPayload },
    { rejectWithValue }
  ) => {
    try {
      const res: ContactResponse = await updateContact(contactId, payload);
      return res.data.contact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update contact'
      );
    }
  }
);

export const removeContactFromGroupThunk = createAsyncThunk(
  'contacts/removeContactFromGroup',
  async (
    { contactId, groupId }: { contactId: string; groupId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await removeContactFromGroup(contactId, groupId);
      return response.data.contact;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to remove contact from group'
      );
    }
  }
);

export const deleteContactThunk = createAsyncThunk(
  'contact/delete',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const res: ContactResponse = await deleteContact(contactId);
      return res.data.contact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete contact'
      );
    }
  }
);

export const importContactsThunk = createAsyncThunk(
  'contact/import',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res: ImportContactsResponse = await importContactsFromCSV(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to import contacts'
      );
    }
  }
);

// ──────────────────────────────
// 🧩 Slice
// ──────────────────────────────

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch All Contacts
      .addCase(fetchAllContactsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContactsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllContactsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Contacts by Group ID
      .addCase(fetchContactsByGroupIdThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactsByGroupIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContactsByGroupIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Contact
      .addCase(createContactThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContactThunk.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.loading = false;
      })
      .addCase(createContactThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Contact
      .addCase(updateContactThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactThunk.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.contacts[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateContactThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove Contact from Group
      .addCase(removeContactFromGroupThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContactFromGroupThunk.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload.id);
        state.loading = false;
      })
      .addCase(removeContactFromGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Contact
      .addCase(deleteContactThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactThunk.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload.id);
        state.loading = false;
      })
      .addCase(deleteContactThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Import Contacts
      .addCase(importContactsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importContactsThunk.fulfilled, state => {
        state.loading = false;
      })
      .addCase(importContactsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = contactSlice.actions;

export default contactSlice.reducer;
