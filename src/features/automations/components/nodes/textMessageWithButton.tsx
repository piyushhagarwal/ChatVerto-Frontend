import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handle, Position } from '@xyflow/react';
import TextMessageWithButtonsSidebar from '../sidebars/textMessageWithButtonSidebar';

interface ButtonItem {
  id: string;
  label: string;
}

interface NodeProps {
  id: string;
  data: {
    message: string;
    buttons: ButtonItem[];
  };
}

export default function TextMessageWithButtonsNode({ id, data }: NodeProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative w-full max-w-sm pr-2">
      <Handle
        type="target"
        position={Position.Left}
        id="textMessageWithButtonTarget"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <Card className="shadow-md border w-full overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg">Text Message with Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-[80px] overflow-hidden text-sm text-muted-foreground whitespace-pre-line group mb-4">
            <p className="line-clamp-4 group-hover:overflow-auto group-hover:max-h-[200px] group-hover:pr-2 transition-all">
              {data.message !== '' ? data.message : 'No message set yet.'}
            </p>
          </div>

          {/* Buttons styled as flow elements with integrated handles */}
          {data.buttons.map(btn => (
            <div key={btn.id} className="relative w-full mb-2 ">
              <div className="flex items-center">
                {/* Button with rounded right edge cut off */}
                <div className="flex-1 px-4 py-3 bg-blue-50 border border-blue-200 rounded-l-lg rounded-r-lg text-sm font-medium text-blue-900">
                  {btn.label}
                </div>

                {/* Handle integrated as part of the button design */}
                <div className="relative">
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`button-${btn.id}`}
                    style={{
                      right: -27,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#3b82f6',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '2px solid white',
                      zIndex: 10,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => setShowSidebar(true)}
          >
            {data.message !== '' || data.buttons.length > 0
              ? 'Edit Message & Buttons'
              : 'Click To Add Message & Buttons'}
          </Button>
        </CardFooter>
      </Card>

      {showSidebar && (
        <TextMessageWithButtonsSidebar
          nodeId={id}
          initialData={data}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
