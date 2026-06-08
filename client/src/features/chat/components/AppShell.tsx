import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAuthContext } from '../../auth/components/AuthGate';
import { SidebarNav } from './SidebarNav';
import { GlobalTopBar } from './GlobalTopBar';
import { MainWorkspace } from './MainWorkspace';
import { useChatSocket } from '../hooks/useChatSocket';
import { GET_CONVERSATIONS } from '../graphql/chat.queries';

interface ConversationsData {
  conversations: Array<{ unreadCount: number; mentionCount: number }>;
}

export function AppShell() {
  const { user, logout } = useAuthContext();
  useChatSocket();

  const { data } = useQuery<ConversationsData>(GET_CONVERSATIONS);
  const totalUnreadCount = useMemo(() => {
    if (!data?.conversations) return 0;
    return data.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [data]);

  const totalMentionCount = useMemo(() => {
    if (!data?.conversations) return 0;
    return data.conversations.reduce((sum, c) => sum + (c.mentionCount || 0), 0);
  }, [data]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-app-bg">
      <SidebarNav totalUnreadCount={totalUnreadCount} hasMention={totalMentionCount > 0} />
      <div className="flex flex-1 flex-col">
        <GlobalTopBar currentUser={user} onLogout={logout} />
        <MainWorkspace />
      </div>
    </div>
  );
}
