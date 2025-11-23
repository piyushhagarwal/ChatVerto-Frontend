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
import { ExternalLink, MessageSquare } from 'lucide-react';
import TextMessageWithButtonsSidebar from '../sidebars/textMessageWithButtonSidebar';

interface ButtonItem {
  id: string;
  label: string;
  url?: string;
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

  const urlButtons = data.buttons?.filter(b => b.url && b.url.trim()) || [];
  const replyButtons = data.buttons?.filter(b => !b.url || !b.url.trim()) || [];

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Interactive Button Message
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Message Preview */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Message:
            </div>
            <div className="relative max-h-[80px] overflow-hidden text-sm text-gray-700 whitespace-pre-line group bg-gray-50 p-2 rounded border">
              <p className="line-clamp-4 group-hover:overflow-auto group-hover:max-h-[200px] group-hover:pr-2 transition-all">
                {data.message !== '' ? data.message : 'No message set yet.'}
              </p>
            </div>
          </div>

          {/* Buttons Label */}
          {data.buttons && data.buttons.length > 0 && (
            <div className="text-xs font-medium text-gray-500 mb-2">
              Buttons: {replyButtons.length} Reply, {urlButtons.length} URL
            </div>
          )}

          {/* Buttons Display */}
          {data.buttons?.map(btn => {
            const isUrlButton = btn.url && btn.url.trim() !== '';
            return (
              <div key={btn.id} className="relative w-full mb-2">
                <div className="flex items-center">
                  <div
                    className={`flex-1 px-4 py-3 border rounded-l-lg rounded-r-lg text-sm font-medium flex items-center gap-2 ${
                      isUrlButton
                        ? 'bg-purple-50 border-purple-200 text-purple-900'
                        : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                  >
                    {isUrlButton ? (
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{btn.label}</span>
                  </div>
                  {/* Handle only for reply buttons */}
                  {!isUrlButton && (
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
                  )}
                </div>
                {/* Show URL below for URL buttons */}
                {isUrlButton && (
                  <div className="mt-1 ml-1 text-xs text-purple-600 truncate">
                    🔗 {btn.url}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => setShowSidebar(true)}
          >
            {data.message !== '' || (data.buttons && data.buttons.length > 0)
              ? 'Edit Interactive Message'
              : 'Create Interactive Message'}
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
