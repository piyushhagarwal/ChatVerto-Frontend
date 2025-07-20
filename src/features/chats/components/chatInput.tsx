import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChatInput() {
  return (
    <div className="p-4 border-t flex gap-2">
      <Input placeholder="Type a message..." />
      <Button>Send</Button>
    </div>
  );
}
