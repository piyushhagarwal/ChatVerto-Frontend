import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Contact,
  ContactListResponse,
  ContactResponse,
  CreateSingleContactPayload,
  UpdateContactPayload,
  ImportContactsResponse,
} from '@/types/contact';
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
  importContactsFromCSV,
} from '@/api/endpoints/contact';

interface ContactState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null,
};

// ──────────────────────────────
// 🔁 Thunks
// ──────────────────────────────

export const fetchAllContactsThunk = createAsyncThunk(
  'contact/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res: ContactListResponse = await getAllContacts();
      return res.data.contacts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch contacts');
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
      return rejectWithValue(err.response?.data?.message || 'Failed to create contact');
    }
  }
);

export const updateContactThunk = createAsyncThunk(
  'contact/update',
  async (
    { contactId, payload }: { contactId: string; payload: UpdateContactPayload },
    { rejectWithValue }
  ) => {
    try {
      const res: ContactResponse = await updateContact(contactId, payload);
      return res.data.contact;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update contact');
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
      return rejectWithValue(err.response?.data?.message || 'Failed to delete contact');
    }
  }
);

// export const importContactsThunk = createAsyncThunk(
//   'contact/import',
//   async (formData: FormData, { rejectWithValue }) => {
//     try {
//       const res: ImportContactsResponse = await importContactsFromCSV(formData);
//       return res.data.contact;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to import contacts');
//     }
//   }
// );

// ──────────────────────────────
// 🧩 Slice
// ──────────────────────────────

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllContactsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContactsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchAllContactsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createContactThunk.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })

      .addCase(updateContactThunk.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.contacts[index] = action.payload;
      })

      .addCase(deleteContactThunk.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload.id);
      })

    //   .addCase(importContactsThunk.fulfilled, (state, action) => {
    //     state.contacts = [...state.contacts, ...action.payload];
    //   });
  },
});

export default contactSlice.reducer;
