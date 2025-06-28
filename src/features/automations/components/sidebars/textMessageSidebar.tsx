import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Use Textarea for better UX with messages
import { useState } from 'react';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { useAppDispatch } from '@/store/hooks';

interface TextMessageSidebarProps {
  nodeId: string;
  initialData: {
    message?: string;
  };
  onClose?: () => void;
}

export default function TextMessageSidebar({
  nodeId,
  initialData,
  onClose,
}: TextMessageSidebarProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState(initialData.message || '');

  const handleSave = () => {
    dispatch(
      updateNodeData({
        nodeId,
        data: { message },
      })
    );
    if (onClose) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-[350px] bg-white shadow-xl border-l pointer-events-auto overflow-y-auto">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Text Message</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Message Content
            </label>
            <Textarea
              className="w-full"
              rows={6}
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          <Button className="mt-auto w-full" onClick={handleSave}>
            Save Message
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
