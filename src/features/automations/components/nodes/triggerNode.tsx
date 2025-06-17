import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TriggerSidebar from '../sidebars/triggerSidebar'; // Adjust path if needed
import { Badge } from '@/components/ui/badge'; // Assuming you have a badge/tag component
import { Handle, Position } from '@xyflow/react';

interface TriggerNodeProps {
  id: string;
  data: {
    keywords?: string[];
  };
}

export default function TriggerNode({ id, data }: TriggerNodeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb', // Tailwind blue-600
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Card className="w-full max-w-sm shadow-md border ">
        <CardHeader>
          <CardTitle className="text-lg">Trigger</CardTitle>
          <CardDescription className="mt-2">Active Keywords</CardDescription>
        </CardHeader>

        <CardContent>
          {data.keywords && data.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((word, index) => (
                <Badge key={index} variant="secondary">
                  {word}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No keywords added yet.
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            Add Keyword
          </Button>
        </CardFooter>
      </Card>

      {isSidebarOpen && (
        <TriggerSidebar
          nodeId={id} // ✅ Pass node ID to the sidebar
          initialData={data} // ✅ Pass current data
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
