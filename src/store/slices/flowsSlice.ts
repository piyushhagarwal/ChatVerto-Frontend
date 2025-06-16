/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import {
  getAllFlows,
  getSingleFlow,
  createFlow,
  updateFlow,
  deleteFlow,
} from '../../api/endpoints/flows';
import type {
  FlowMeta,
  FlowNode,
  FlowEdge,
  FlowListResponse,
  FlowResponse,
  CreateFlowPayload,
  UpdateFlowPayload,
} from '../../types/flows';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

interface CurrentFlow {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  saved: boolean;
}

interface FlowState {
  flows: FlowMeta[];
  currentFlow: CurrentFlow | null;
  loading: boolean;
  error: string | null;
}

const initialState: FlowState = {
  flows: [],
  currentFlow: null,
  loading: false,
  error: null,
};

// ──────────────────────────────
// 🔁 Async Thunks
// ──────────────────────────────

// Fetch all flows
export const fetchAllFlowsThunk = createAsyncThunk(
  'flow/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res: FlowListResponse = await getAllFlows();
      return res.data.flows;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch flows'
      );
    }
  }
);

// Fetch single flow by ID
export const fetchFlowByIdThunk = createAsyncThunk(
  'flow/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res: FlowResponse = await getSingleFlow(id);
      return {
        ...res.data.flow,
        saved: true,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch flow'
      );
    }
  }
);

// Save (create or update) flow
export const saveFlowThunk = createAsyncThunk(
  'flow/save',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { flow: FlowState };
    const flow = state.flow.currentFlow;
    if (!flow) return rejectWithValue('No flow to save');

    const payload: CreateFlowPayload | UpdateFlowPayload = {
      name: flow.name,
      nodes: flow.nodes,
      edges: flow.edges,
    };

    try {
      if (flow.id.startsWith('temp-')) {
        const res = await createFlow(payload as CreateFlowPayload);
        return {
          ...res.data.flow,
          saved: true,
        };
      } else {
        const res = await updateFlow(flow.id, payload as UpdateFlowPayload);
        return {
          ...res.data.flow,
          saved: true,
        };
      }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to save flow'
      );
    }
  }
);

// Delete flow
export const deleteFlowThunk = createAsyncThunk(
  'flow/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteFlow(id);
      return res.data.flow;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete flow'
      );
    }
  }
);

// ──────────────────────────────
// 🔧 Slice
// ──────────────────────────────

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    // Create new flow locally
    createNewFlow: (state, action: PayloadAction<string>) => {
      const tempId = `temp-${nanoid()}`;
      state.currentFlow = {
        id: tempId,
        name: action.payload || 'Untitled',
        nodes: [
          {
            id: nanoid(),
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: {},
          },
        ],
        edges: [],
        saved: false,
      };
    },

    // Rename current flow
    renameFlow: (state, action: PayloadAction<string>) => {
      if (state.currentFlow) {
        state.currentFlow.name = action.payload;
        state.currentFlow.saved = false;
      }
    },

    // Handle node changes
    applyNodeChangesAction: (state, action: PayloadAction<any>) => {
      if (state.currentFlow) {
        state.currentFlow.nodes = applyNodeChanges(
          action.payload,
          state.currentFlow.nodes
        );
        state.currentFlow.saved = false;
      }
    },

    // Handle edge changes
    applyEdgeChangesAction: (state, action: PayloadAction<any>) => {
      if (state.currentFlow) {
        state.currentFlow.edges = applyEdgeChanges(
          action.payload,
          state.currentFlow.edges
        );
        state.currentFlow.saved = false;
      }
    },

    // Add new edge on connect
    addEdgeToFlow: (state, action: PayloadAction<any>) => {
      if (state.currentFlow) {
        state.currentFlow.edges = addEdge(
          { ...action.payload, id: nanoid(), type: 'default' },
          state.currentFlow.edges
        );
        state.currentFlow.saved = false;
      }
    },

    // Add new node to current flow
    addNodeToFlow: (state, action: PayloadAction<string>) => {
      // action.payload is the node type
      if (state.currentFlow) {
        const newNode: FlowNode = {
          id: nanoid(),
          type: action.payload,
          position: { x: 100, y: 100 },
          data: {},
        };
        state.currentFlow.nodes.push(newNode);
        state.currentFlow.saved = false;
      }
    },

    // Update node data
    updateNodeData: (
      state,
      action: PayloadAction<{ nodeId: string; data: Record<string, any> }>
    ) => {
      const { nodeId, data } = action.payload;
      if (state.currentFlow) {
        const nodeIndex = state.currentFlow.nodes.findIndex(
          node => node.id === nodeId
        );
        if (nodeIndex !== -1) {
          state.currentFlow.nodes[nodeIndex].data = {
            ...state.currentFlow.nodes[nodeIndex].data,
            ...data,
          };
          state.currentFlow.saved = false;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllFlowsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFlowsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.flows = action.payload;
      })
      .addCase(fetchAllFlowsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchFlowByIdThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlow = action.payload;
      })
      .addCase(fetchFlowByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(saveFlowThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveFlowThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlow = {
          ...action.payload,
          saved: true,
        };
      })
      .addCase(saveFlowThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteFlowThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlowThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.flows = state.flows.filter(flow => flow.id !== action.payload.id);
        if (state.currentFlow?.id === action.payload.id) {
          state.currentFlow = null; // Clear current flow if deleted
        }
      })
      .addCase(deleteFlowThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ──────────────────────────────
// 🧠 Export
// ──────────────────────────────

export const {
  createNewFlow,
  renameFlow,
  applyNodeChangesAction,
  applyEdgeChangesAction,
  addEdgeToFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
