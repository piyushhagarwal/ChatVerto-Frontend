import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { useAppDispatch } from '@/store/hooks';

interface ButtonItem {
  id: string;
  label: string;
}

interface SidebarProps {
  nodeId: string;
  initialData: {
    message: string;
    buttons: ButtonItem[];
  };
  onClose: () => void;
}

export default function TextMessageWithListSidebar({
  nodeId,
  initialData,
  onClose,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState(initialData.message || '');
  const [buttons, setButtons] = useState<ButtonItem[]>(
    initialData.buttons || []
  );

  const updateButtonLabel = (index: number, newLabel: string) => {
    const updated = [...buttons];
    updated[index].label = newLabel;
    setButtons(updated);
  };

  const addButton = () => {
    setButtons([...buttons, { id: nanoid(), label: '' }]);
  };

  const removeButton = (index: number) => {
    const updated = [...buttons];
    updated.splice(index, 1);
    setButtons(updated);
  };

  const handleSave = () => {
    dispatch(
      updateNodeData({
        nodeId,
        data: {
          message: message.trim(),
          buttons: buttons.filter(b => b.label.trim()),
        },
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
      <div className="absolute left-0 top-0 h-full w-[400px] bg-white shadow-xl border-l pointer-events-auto overflow-y-auto">
        <div className="p-4 flex flex-col h-full gap-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Text Message with Buttons</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Message Textarea */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Message Content
            </Label>
            <Textarea
              className="w-full"
              rows={6}
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          {/* Buttons Section */}
          <div className="flex items-center justify-between mt-2">
            <Label className="text-sm font-medium">Buttons</Label>
            <Button size="sm" onClick={addButton}>
              Add Button
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {buttons.map((btn, index) => (
              <div key={btn.id} className="flex items-center gap-2">
                <Input
                  placeholder={`Button ${index + 1} label`}
                  value={btn.label}
                  onChange={e => updateButtonLabel(index, e.target.value)}
                  className="flex-1"
                />
                <Trash2
                  className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => removeButton(index)}
                />
              </div>
            ))}
          </div>

          {buttons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No buttons added yet. Click "Add Button" to create your first
              button.
            </p>
          )}

          {/* Save Button */}
          <Button className="mt-auto w-full" onClick={handleSave}>
            Save Message & Buttons
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
