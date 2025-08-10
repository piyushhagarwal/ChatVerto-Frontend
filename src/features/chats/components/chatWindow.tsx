import { Button } from '@/components/ui/button';
import { Paperclip, Mic } from 'lucide-react';

export function ChatWindow({
  selectedChatId,
  onProfileClick,
}: {
  selectedChatId: string | null;
  onProfileClick: () => void;
}) {
  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-r">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-t px-4 py-2">
        <div className="font-medium text-sm">
          Chat with ID: {selectedChatId}
        </div>
        <Button variant="ghost" size="sm" onClick={onProfileClick}>
          View Profile
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        <div className="bg-gray-100 p-2 rounded self-start max-w-xs">
          Hello! How can I help you today?
        </div>
        <div className="bg-green-100 p-2 rounded self-end max-w-xs ml-auto">
          I need help with my order.
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-2 p-4 border-t">
        <Button variant="ghost" size="icon">
          <Paperclip className="w-5 h-5" />
        </Button>
        <input
          className="flex-1 border rounded px-4 py-2 text-sm"
          placeholder="Type your message..."
        />
        <Button variant="ghost" size="icon">
          <Mic className="w-5 h-5" />
        </Button>
        <Button size="sm">Send</Button>
      </div>
    </div>
  );
}
