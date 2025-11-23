/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, AlertCircle, Info } from 'lucide-react';
import { nanoid } from 'nanoid';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { useAppDispatch } from '@/store/hooks';

interface ButtonItem {
  id: string;
  label: string;
  url?: string;
}

interface SidebarProps {
  nodeId: string;
  initialData: {
    message: string;
    buttons: ButtonItem[];
  };
  onClose: () => void;
}

const MAX_REPLY_BUTTONS = 3;
const MAX_URL_BUTTONS = 1; // Interactive messages only support 1 URL button
const MAX_BUTTON_LABEL_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 1024;

export default function TextMessageWithButtonsSidebar({
  nodeId,
  initialData,
  onClose,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState(initialData.message || '');
  const [buttons, setButtons] = useState<ButtonItem[]>(
    initialData.buttons || []
  );
  const [errors, setErrors] = useState<{
    message?: string;
    buttons?: { [key: number]: string };
  }>({});

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    try {
      const urlObj = new URL(url.trim());
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const updateButtonLabel = (index: number, newLabel: string) => {
    const truncated = newLabel.slice(0, MAX_BUTTON_LABEL_LENGTH);
    const updated = [...buttons];
    updated[index].label = truncated;
    setButtons(updated);

    if (truncated.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors.buttons) {
          delete newErrors.buttons[index];
          if (Object.keys(newErrors.buttons).length === 0) {
            delete newErrors.buttons;
          }
        }
        return newErrors;
      });
    }
  };

  const updateButtonUrl = (index: number, newUrl: string) => {
    const updated = [...buttons];
    updated[index].url = newUrl;
    setButtons(updated);

    const urlButtonCount = updated.filter(b => b.url && b.url.trim()).length;

    if (urlButtonCount > MAX_URL_BUTTONS) {
      setErrors(prev => ({
        ...prev,
        buttons: {
          ...prev.buttons,
          [index]: `Only ${MAX_URL_BUTTONS} URL buttons allowed per message`,
        },
      }));
      return;
    }

    if (newUrl.trim() && !validateUrl(newUrl)) {
      setErrors(prev => ({
        ...prev,
        buttons: {
          ...prev.buttons,
          [index]: 'Invalid URL format. Must start with http:// or https://',
        },
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors.buttons) {
          delete newErrors.buttons[index];
          if (Object.keys(newErrors.buttons).length === 0) {
            delete newErrors.buttons;
          }
        }
        return newErrors;
      });
    }
  };

  const addButton = () => {
    const urlButtonCount = buttons.filter(b => b.url && b.url.trim()).length;
    const replyButtonCount = buttons.filter(
      b => !b.url || !b.url.trim()
    ).length;

    if (replyButtonCount >= MAX_REPLY_BUTTONS) {
      setErrors(prev => ({
        ...prev,
        message: `Maximum ${MAX_REPLY_BUTTONS} reply buttons allowed`,
      }));
      return;
    }

    if (urlButtonCount >= MAX_URL_BUTTONS) {
      setErrors(prev => ({
        ...prev,
        message: `Only ${MAX_URL_BUTTONS} URL buttons allowed per message`,
      }));
      return;
    }

    setButtons([...buttons, { id: nanoid(), label: '', url: '' }]);
    setErrors(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: _, ...rest } = prev;
      return rest;
    });
  };

  const removeButton = (index: number) => {
    const updated = [...buttons];
    updated.splice(index, 1);
    setButtons(updated);

    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.buttons) {
        delete newErrors.buttons[index];
        if (Object.keys(newErrors.buttons).length === 0) {
          delete newErrors.buttons;
        }
      }
      return newErrors;
    });
  };

  const handleSave = () => {
    const trimmedMessage = message.trim();
    const newErrors: typeof errors = {};

    if (!trimmedMessage) {
      newErrors.message = 'Message content is required';
    } else if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`;
    }

    const validButtons = buttons.filter(b => b.label.trim());
    const urlButtons = validButtons.filter(b => b.url && b.url.trim());
    const replyButtons = validButtons.filter(b => !b.url || !b.url.trim());

    if (validButtons.length === 0) {
      newErrors.message = newErrors.message
        ? `${newErrors.message}. Also, at least one button with a label is required`
        : 'At least one button with a label is required';
    }

    if (urlButtons.length > MAX_URL_BUTTONS) {
      newErrors.message = newErrors.message
        ? `${newErrors.message}. Also, only ${MAX_URL_BUTTONS} URL buttons allowed`
        : `Only ${MAX_URL_BUTTONS} URL buttons allowed per message`;
    }

    if (replyButtons.length > MAX_REPLY_BUTTONS) {
      newErrors.message = newErrors.message
        ? `${newErrors.message}. Also, maximum ${MAX_REPLY_BUTTONS} reply buttons allowed`
        : `Maximum ${MAX_REPLY_BUTTONS} reply buttons allowed per message`;
    }

    const buttonErrors: { [key: number]: string } = {};
    buttons.forEach((btn, index) => {
      if (btn.url && btn.url.trim() && !validateUrl(btn.url)) {
        buttonErrors[index] = 'Invalid URL format';
      }
    });

    if (Object.keys(buttonErrors).length > 0) {
      newErrors.buttons = buttonErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: any = {
      message: trimmedMessage,
      buttons: validButtons.map(b => ({
        id: b.id,
        label: b.label.trim(),
        ...(b.url && b.url.trim() ? { url: b.url.trim() } : {}),
      })),
    };

    dispatch(updateNodeData({ nodeId, data }));
    if (onClose) onClose();
  };

  const messageCharsRemaining = MAX_MESSAGE_LENGTH - message.length;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 h-full w-[440px] bg-white shadow-xl border-l pointer-events-auto overflow-y-auto">
        <div className="p-4 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              Interactive Button Message
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {errors.message && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.message}</p>
            </div>
          )}

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">
                Message Content <span className="text-red-500">*</span>
              </Label>
              <span
                className={`text-xs ${messageCharsRemaining < 0 ? 'text-red-500' : 'text-gray-500'}`}
              >
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <Textarea
              className={`w-full ${messageCharsRemaining < 0 ? 'border-red-500' : ''}`}
              rows={5}
              placeholder="Type your message here..."
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                if (errors.message) {
                  setErrors(prev => {
                    const { message: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              maxLength={MAX_MESSAGE_LENGTH}
            />
          </div>

          {/* Buttons Section */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Buttons <span className="text-red-500">*</span>
            </Label>
            <Button
              size="sm"
              onClick={addButton}
              disabled={buttons.length >= MAX_REPLY_BUTTONS}
            >
              Add Button
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {buttons.map((btn, index) => {
              const labelCharsRemaining =
                MAX_BUTTON_LABEL_LENGTH - btn.label.length;
              const isUrlButton = btn.url && btn.url.trim();
              return (
                <div key={btn.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <Label className="text-xs font-medium text-gray-700">
                      Button {index + 1} {isUrlButton && '🔗'}
                    </Label>
                    <Trash2
                      className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => removeButton(index)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Label</span>
                        <span
                          className={`text-xs ${labelCharsRemaining < 5 ? 'text-orange-600' : 'text-gray-400'}`}
                        >
                          {btn.label.length}/{MAX_BUTTON_LABEL_LENGTH}
                        </span>
                      </div>
                      <Input
                        placeholder="Button label"
                        value={btn.label}
                        onChange={e => updateButtonLabel(index, e.target.value)}
                        className="w-full"
                        maxLength={MAX_BUTTON_LABEL_LENGTH}
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-600 mb-1 block">
                        URL (optional)
                      </span>
                      <Input
                        placeholder="https://example.com"
                        value={btn.url || ''}
                        onChange={e => updateButtonUrl(index, e.target.value)}
                        className={`w-full ${errors.buttons?.[index] ? 'border-red-500' : ''}`}
                      />
                      {errors.buttons?.[index] && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.buttons[index]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Info className="w-3 h-3" />
                      <span>
                        {isUrlButton ? '🔗 URL Button' : '💬 Reply Button'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {buttons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No buttons added yet. Click "Add Button" to create your first
              button.
            </p>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
            <p className="font-medium mb-2">📋 WhatsApp Limits:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Reply Buttons: Max {MAX_REPLY_BUTTONS}</li>
              <li>URL Buttons: Max {MAX_URL_BUTTONS}</li>
              <li>Cannot mix both types in same message!</li>
              <li>Button labels: max {MAX_BUTTON_LABEL_LENGTH} chars</li>
            </ul>
          </div>

          <Button className="mt-auto w-full" onClick={handleSave}>
            Save Interactive Message
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
