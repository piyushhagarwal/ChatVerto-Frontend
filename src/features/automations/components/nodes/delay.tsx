import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import DelaySidebar from '../sidebars/delaySidebar';
import { Handle, Position } from '@xyflow/react';

interface DelayProps {
  id: string;
  data: {
    delayMinutes?: number;
  };
}

export default function DelayNode({ id, data }: DelayProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="delayTarget"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="delaySource"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Node UI */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Delay</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            {data.delayMinutes
              ? `Wait for ${data.delayMinutes} minute(s)`
              : 'No delay set yet.'}
          </p>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => setIsSidebarOpen(true)}>
            {data.delayMinutes ? 'Edit Delay' : 'Set Delay'}
          </Button>
        </CardFooter>
      </Card>

      {/* Sidebar */}
      {isSidebarOpen && (
        <DelaySidebar
          nodeId={id}
          initialData={data}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
