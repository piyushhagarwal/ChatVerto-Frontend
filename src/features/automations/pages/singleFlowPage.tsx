/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  MessageSquare,
  List,
  MessageCircleMore,
  Image,
  Clock,
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
    type: 'textMessageWithList',
    label: 'Text Message with List',
    description: 'Send a text message with a list of options',
    icon: List,
    initialData: {
      message: '',
      buttons: [],
    },
  },
  {
    type: 'mediaMessage',
    label: 'Media Message',
    description: 'Send images, videos, or documents',
    icon: Image,
    initialData: {
      mediaType: undefined,
      mediaId: undefined,
      caption: undefined,
      fileName: undefined,
    },
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Pause the flow for a set time (up to 2 hours)',
    icon: Clock,
    initialData: {
      delayMinutes: 0,
    },
  },
];

export default function SingleFlowPage() {
  const { flowId } = useParams<{ flowId: string }>();
  const dispatch = useAppDispatch();
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

  return (
    <div
      className="flex flex-col h-full "
      style={{
        backgroundImage: `radial-gradient(#9ca3af 1.3px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Header */}
      <div className="shadow-[0_0_5px_rgba(0,0,0,0.2)] border-b border-gray-200 px-[5px] py-2">
        <div className="flex items-center justify-between bg-primary py-4 px-6 rounded-lg shadow-sm">
          {/* Flow Name - Left Side */}
          <div className="flex items-center space-x-3">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-xl font-semibold min-w-[200px] border-primary text-primary bg-card focus:ring-primary"
                  placeholder="Enter flow name"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  className="h-8 w-8 p-0 bg-accent hover:bg-accent/80"
                >
                  <Check className="h-4 w-4 text-primary" />
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
                <h1 className="text-2xl font-semibold text-white">
                  {currentFlow?.name || 'Untitled Flow'}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEditName}
                  className="group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-accent hover:text-gray-600"
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
                <span className="text-sm text-white">
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
                <Button className="bg-accent text-primary hover:bg-accent/80 shadow-sm">
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
                  ? 'bg-accent hover:bg-green-700 text-primary'
                  : 'bg-accent hover:bg-accent/70 text-primary'
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
            <Link to="/dashboard/automation">
              <Button className="bg-accent hover:bg-accent/80 text-Primary">
                Back To Automations
              </Button>
            </Link>
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
