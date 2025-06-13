import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function TriggerSidebar({ onClose }: { onClose?: () => void }) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: handle WhatsApp message submit
    console.log('Submitted Message:', message);
    if (onClose) onClose(); // Optional: close sidebar after submit
  };

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        open={true}
        className="w-[400px] border-l bg-white shadow-xl"
      >
        <SidebarContent className="p-4 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Create Trigger Message</h2>

          <Textarea
            placeholder="Type your WhatsApp message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="mb-4 resize-none h-32" // Set a fixed height here
          />

          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
