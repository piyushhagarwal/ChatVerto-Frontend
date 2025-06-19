import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import TextMessageSidebar from '../sidebars/textMessageSidebar';
import { Handle, Position } from '@xyflow/react';

interface TextMessageProps {
  id: string;
  data: {
    message: string;
  };
}

export default function TextMessageNode({ id, data }: TextMessageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        id="textMessageTarget"
        // Style for the target handle
        style={{
          width: 10,
          height: 10,
          background: '#2563eb', // Tailwind blue-600
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="textMessageSource"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb', // Tailwind blue-600
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Text Message</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative max-h-[80px] overflow-hidden text-sm text-muted-foreground whitespace-pre-line group">
            <p className="line-clamp-4 group-hover:overflow-auto group-hover:max-h-[200px] group-hover:pr-2 transition-all">
              {data.message !== '' ? data.message : 'No message yet.'}
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            {data.message !== '' ? 'Edit Message' : 'Click To Write Message'}
          </Button>
        </CardFooter>
      </Card>
      {isSidebarOpen && (
        <TextMessageSidebar
          nodeId={id}
          initialData={data}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
