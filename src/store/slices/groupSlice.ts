/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  GroupContact,
  GroupContactListResponse,
  GroupContactResponse,
  CreateGroupContactPayload,
  UpdateGroupContactPayload,
  SingleGroupResponse,
} from '@/types/contact';
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
} from '@/api/endpoints/contact';

interface GroupState {
  groups: GroupContact[];
  selectedGroup: GroupContact | null;
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,
};

// ──────────────────────────────
// 🔁 Thunks
// ──────────────────────────────

export const fetchAllGroupsThunk = createAsyncThunk(
  'group/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res: GroupContactListResponse = await getAllGroups();
      return res.data?.groups;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch groups'
      );
    }
  }
);

export const fetchGroupWithIdThunk = createAsyncThunk(
  'group/fetchSingle',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const res: SingleGroupResponse = await getGroupById(groupId);
      return res.data?.group;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch group'
      );
    }
  }
);

export const createGroupThunk = createAsyncThunk(
  'group/create',
  async (payload: CreateGroupContactPayload, { rejectWithValue }) => {
    try {
      const res: GroupContactResponse = await createGroup(payload);
      return res.data?.groupContact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create group'
      );
    }
  }
);

export const updateGroupThunk = createAsyncThunk(
  'group/update',
  async (
    {
      groupId,
      payload,
    }: { groupId: string; payload: UpdateGroupContactPayload },
    { rejectWithValue }
  ) => {
    try {
      const res: GroupContactResponse = await updateGroup(groupId, payload);
      return res.data?.groupContact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update group'
      );
    }
  }
);

export const deleteGroupThunk = createAsyncThunk(
  'group/delete',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const res: GroupContactResponse = await deleteGroup(groupId);
      return res.data?.groupContact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete group'
      );
    }
  }
);

// ──────────────────────────────
// 🧩 Slice
// ──────────────────────────────

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllGroupsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroupsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload ?? [];
      })
      .addCase(fetchAllGroupsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchGroupWithIdThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupWithIdThunk.fulfilled, (state, action) => {
        state.selectedGroup = action.payload || null;
      })
      .addCase(fetchGroupWithIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createGroupThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.groups.push(action.payload);
        }
      })
      .addCase(createGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateGroupThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroupThunk.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        if (updatedGroup) {
          const index = state.groups.findIndex(g => g.id === updatedGroup.id);
          if (index !== -1) state.groups[index] = updatedGroup;
        }
      })
      .addCase(updateGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteGroupThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroupThunk.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g.id !== action.payload?.id);
        state.selectedGroup = null;
      })
      .addCase(deleteGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = groupSlice.actions;

export default groupSlice.reducer;
