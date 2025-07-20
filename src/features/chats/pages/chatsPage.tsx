import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { ChatSidebar } from '../components/chatSidebar';
import { ChatWindow } from '../components/chatWindow';
import { ProfilePanel } from '../components/profilePanel';

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <SiteHeader title="Chats" />
      <div className="flex h-[calc(100vh-6.5rem)]">
        <ChatSidebar
          selectedChat={selectedChatId}
          setSelectedChat={setSelectedChatId}
        />
        <ChatWindow
          selectedChatId={selectedChatId}
          onProfileClick={() => setShowProfile(true)}
        />
        {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
      </div>
    </>
  );
}
