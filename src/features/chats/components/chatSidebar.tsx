import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const demoChats = [
  { id: '1', name: 'Amit Verma', lastMessage: 'Thanks!', status: 'Active' },
  {
    id: '2',
    name: 'Neha Sharma',
    lastMessage: 'What time?',
    status: 'Responded',
  },
  {
    id: '3',
    name: 'Chatverto Bot',
    lastMessage: 'Resolved ✅',
    status: 'Requesting',
    isBot: true,
  },
];

const filters = ['All', 'Active', 'Responded', 'Requesting'];

export function ChatSidebar({ selectedChat, setSelectedChat }: any) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredChats =
    selectedFilter === 'All'
      ? demoChats
      : demoChats.filter(chat => chat.status === selectedFilter);

  return (
    <div className="w-[330px] border-r border-t h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Input placeholder="Search chats..." />
        <Button variant="ghost" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex justify-around px-5 pb-2 mr-10">
        {filters.map(f => (
          <Button
            key={f}
            variant={selectedFilter === f ? 'default' : 'ghost'}
            onClick={() => setSelectedFilter(f)}
            className="text-xs"
          >
            {f}
          </Button>
        ))}
      </div>
      <ScrollArea className="flex-1">
        <ul>
          {filteredChats.map(chat => (
            <li
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b ${
                selectedChat === chat.id ? 'bg-muted' : ''
              }`}
            >
              <div className="font-semibold flex justify-between">
                <span>{chat.name}</span>
                {chat.isBot && (
                  <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                    Bot
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {chat.lastMessage}
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
