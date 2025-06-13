'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TextMessageSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    console.log('Message:', message);
    console.log('URL:', url);
    onClose();
  };

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        open={true}
        className="w-[400px] border-l bg-white shadow-xl transition-all duration-300"
      >
        <SidebarContent className="p-4 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Send Message</h2>

          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="mb-4"
          />

          <Input
            placeholder="Optional URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="mb-4"
          />

          <Button onClick={handleSubmit}>Submit</Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
