import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextUpdaterNode from '../../components/reactflowComponents/TextUpdaterNode';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
  {
    id: 'node-2',
    type: 'output',
    targetPosition: Position.Top,
    position: { x: 0, y: 200 },
    data: { label: 'node 2' },
  },
  {
    id: 'node-3',
    type: 'output',
    targetPosition: Position.Top,
    position: { x: 200, y: 200 },
    data: { label: 'node 3' },
  },
  {
    id: 'c',
    type: 'output',
    targetPosition: Position.Top,
    position: { x: 200, y: 300 },
    data: { label: 'node 4' },
  },
];

const initialEdges: Edge[] = [
  { id: 'edge-2', source: 'node-1', target: 'node-3', sourceHandle: 'b' },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
      />
    </div>
  );
}
