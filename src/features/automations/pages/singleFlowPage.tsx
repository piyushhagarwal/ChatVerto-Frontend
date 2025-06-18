/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchFlowByIdThunk,
  saveFlowThunk,
  renameFlow,
  addEdgeToFlow,
  applyNodeChangesAction,
  applyEdgeChangesAction,
  addNodeToFlow,
} from '@/store/slices/flowsSlice';
import { nodeTypes } from '@/types/node';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Save,
  Edit2,
  Check,
  X,
  Loader2,
  Zap,
  MessageSquare,
  Database,
  Globe,
  Filter,
  ReplyAll,
  MessageCircleMore,
} from 'lucide-react';

// Simplified node types with initial data
const NODES = [
  {
    type: 'textMessage',
    label: 'Text Message',
    description: 'Send a text message',
    icon: MessageSquare,
    initialData: {
      message: '',
    },
  },
  {
    type: 'textMessageWithButton',
    label: 'Text Message with Button',
    description: 'Send a text message with buttons',
    icon: MessageCircleMore,
    initialData: {
      message: '',
      buttons: [],
    },
  },
  {
    type: 'database',
    label: 'Database',
    description: 'Interact with a database',
    icon: Database,
    initialData: {
      label: 'Database Node',
      config: {
        operation: 'select',
        table: '',
        description: 'Database operation',
      },
    },
  },
  {
    type: 'api',
    label: 'API Call',
    description: 'Make an HTTP API call',
    icon: Globe,
    initialData: {
      label: 'API Node',
      config: {
        method: 'GET',
        url: '',
        description: 'HTTP API call',
      },
    },
  },
];

export default function SingleFlowPage() {
  const { flowId } = useParams<{ flowId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentFlow, loading, error } = useAppSelector(state => state.flow);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

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

  const handleEditName = () => {
    setTempName(currentFlow?.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      dispatch(renameFlow(tempName.trim()));
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setTempName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleAddNode = (nodeConfig: (typeof NODES)[0]) => {
    // Pass both the type and initial data to the action
    dispatch(
      addNodeToFlow({
        type: nodeConfig.type,
        data: nodeConfig.initialData,
      })
    );
  };

  const handleSave = () => {
    dispatch(saveFlowThunk());
  };

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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Flow Name - Left Side */}
          <div className="flex items-center space-x-3">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-xl font-semibold min-w-[200px] border-primary focus:ring-primary"
                  placeholder="Enter flow name"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 group">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {currentFlow?.name || 'Untitled Flow'}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEditName}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Save Status Indicator */}
            {currentFlow && (
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${currentFlow.saved ? 'bg-green-500' : 'bg-amber-500'}`}
                />
                <span className="text-sm text-gray-500">
                  {currentFlow.saved ? 'Saved' : 'Unsaved changes'}
                </span>
              </div>
            )}
          </div>

          {/* Actions - Right Side */}
          <div className="flex items-center space-x-3">
            {/* Simplified Add Node Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-white shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {NODES.map(nodeConfig => {
                  const Icon = nodeConfig.icon;
                  return (
                    <DropdownMenuItem
                      key={nodeConfig.type}
                      onClick={() => handleAddNode(nodeConfig)}
                      className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {nodeConfig.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {nodeConfig.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Save Flow Button */}
            <Button
              onClick={handleSave}
              disabled={loading || currentFlow?.saved}
              className={`${
                currentFlow?.saved
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } shadow-sm transition-colors`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Flow...
                </>
              ) : currentFlow?.saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Flow Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Flow
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          className="bg-gray-50"
          defaultViewport={{ x: 500, y: 300, zoom: 0.8 }}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background
            color="#e5e7eb"
            gap={20}
            size={1}
            className="opacity-40"
          />
        </ReactFlow>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading flow...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm z-10">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">Error: {error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
