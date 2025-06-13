'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TextMessageSidebarProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    message: string;
    buttonText: string;
    buttonUrl: string;
  }) => void;
}

export default function TextMessageWithButtonSidebar({
  open,
  onClose,
  onSubmit,
}: TextMessageSidebarProps) {
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim() || !buttonText.trim() || !buttonUrl.trim()) {
      setError('All fields are required.');
      return;
    }

    setError('');
    onSubmit({ message, buttonText, buttonUrl });
    setMessage('');
    setButtonText('');
    setButtonUrl('');
    onClose();
  };

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        open={open}
        onClose={onClose}
        className="w-[400px] border-l bg-white shadow-xl transition-all duration-500 ease-in-out"
      >
        <SidebarContent className="p-4 flex flex-col h-full gap-4">
          <h2 className="text-xl font-semibold">
            Create Text Message with Button
          </h2>

          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label>Button Text</Label>
            <Input
              placeholder="Enter button text (e.g. Learn More)"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Button URL</Label>
            <Input
              placeholder="Enter URL (e.g. https://example.com)"
              value={buttonUrl}
              onChange={e => setButtonUrl(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button className="w-full mt-auto" onClick={handleSubmit}>
            Submit
          </Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
