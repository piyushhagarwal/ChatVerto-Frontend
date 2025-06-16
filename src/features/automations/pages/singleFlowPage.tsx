/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchFlowByIdThunk,
  createNewFlow,
  saveFlowThunk,
  renameFlow,
  addEdgeToFlow,
  applyNodeChangesAction,
  applyEdgeChangesAction,
} from '@/store/slices/flowsSlice';
import { nodeTypes } from '@/types/node';

export default function SingleFlowPage() {
  const { flowId } = useParams<{ flowId: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentFlow, loading, error } = useAppSelector(state => state.flow);
  const nodes = currentFlow?.nodes || [];
  const edges = currentFlow?.edges || [];

  const onNodesChange = useCallback(
    (changes: any) => {
      dispatch(applyNodeChangesAction(changes));
    },
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      dispatch(applyEdgeChangesAction(changes));
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (params: any) => {
      dispatch(addEdgeToFlow(params));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!flowId) return;

    if (flowId.startsWith('temp-')) {
      // Do nothing if it's a temporary flow because it is already called when creating a new flow from allFlowsPage
    } else {
      dispatch(fetchFlowByIdThunk(flowId));
    }
  }, [flowId, dispatch]);

  useEffect(() => {
    if (
      currentFlow?.saved &&
      currentFlow.id !== flowId // URL param id
    ) {
      navigate(`/flows/${currentFlow.id}`, { replace: true });
    }
  }, [currentFlow, flowId, navigate]);

  const handleSave = () => {
    dispatch(saveFlowThunk());
  };

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
