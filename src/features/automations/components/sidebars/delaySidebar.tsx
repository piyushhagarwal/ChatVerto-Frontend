import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { useAppDispatch } from '@/store/hooks';

interface DelaySidebarProps {
  nodeId: string;
  initialData: {
    delayMinutes?: number;
  };
  onClose?: () => void;
}

export default function DelaySidebar({
  nodeId,
  initialData,
  onClose,
}: DelaySidebarProps) {
  const dispatch = useAppDispatch();
  const [delayMinutes, setDelayMinutes] = useState(
    initialData.delayMinutes || 0
  );

  const handleSave = () => {
    // Ensure value is between 1 and 120
    const validDelay = Math.min(Math.max(delayMinutes, 1), 120);
    dispatch(
      updateNodeData({
        nodeId,
        data: { delayMinutes: validDelay },
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
            <h2 className="text-xl font-semibold">Set Delay</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Delay (minutes)
            </label>
            <Input
              type="number"
              min={1}
              max={120}
              value={delayMinutes}
              onChange={e => setDelayMinutes(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter a value between 1 and 120 minutes (max 2 hours).
            </p>
          </div>

          <Button className="mt-auto w-full" onClick={handleSave}>
            Save Delay
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
