import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { useAppDispatch } from '@/store/hooks';

interface TriggerSidebarProps {
  nodeId: string;
  initialData: {
    keywords?: string[];
  };
  onClose?: () => void;
}

export default function TriggerSidebar({
  nodeId,
  initialData,
  onClose,
}: TriggerSidebarProps) {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');
  const [warning, setWarning] = useState('');
  const [keywords, setKeywords] = useState<string[]>(
    initialData.keywords || []
  );

  const handleAddKeyword = () => {
    const trimmed = keyword.trim();

    // Check for empty input
    if (!trimmed) {
      setWarning('Keyword cannot be empty');
      return;
    }

    // Check for any spaces (leading, trailing, or middle)
    if (/\s/.test(keyword)) {
      setWarning('Only a single word without spaces is allowed');
      return;
    }

    // Check for duplicates
    if (keywords.includes(trimmed)) {
      setWarning('Keyword already added');
      return;
    }

    // Add keyword if valid
    setKeywords(prev => [...prev, trimmed]);
    setKeyword('');
    setWarning('');
  };

  const handleSubmit = () => {
    dispatch(
      updateNodeData({
        nodeId,
        data: { keywords },
      })
    );
    if (onClose) onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    // Optional: live warning while typing
    if (/^\s|\s$/.test(value)) {
      setWarning('Leading or trailing spaces are not allowed');
    } else if (/\s/.test(value)) {
      setWarning('Only a single word is allowed');
    } else {
      setWarning('');
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Render the sidebar as a portal to document.body
  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-xl border-l pointer-events-auto overflow-y-auto">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Add Keywords</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="flex gap-2 mb-1">
            <Input
              placeholder="Enter a keyword"
              value={keyword}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleAddKeyword}>Add</Button>
          </div>
          {warning && <p className="text-red-500 text-sm ">{warning}</p>}

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 mt-2">
              {keywords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-muted text-sm text-muted-foreground border flex items-center gap-2 cursor-pointer hover:bg-muted/80"
                  onClick={() => removeKeyword(idx)}
                >
                  {word}
                  <span className="text-xs opacity-50">×</span>
                </span>
              ))}
            </div>
          )}

          <Button className="mt-auto w-full" onClick={handleSubmit}>
            Save Keywords
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
