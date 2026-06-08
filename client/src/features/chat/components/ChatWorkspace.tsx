import { useCallback } from 'react';
import { ConversationListPanel, type Conversation } from './ConversationListPanel';
import { ChatPanel } from './ChatPanel';
import { useConversationSelection } from '../hooks/useConversationSelection';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/chat.queries';
import type { MentionUser } from '../hooks/useMentions';

interface UsersData {
  users: MentionUser[];
}

export function ChatWorkspace() {
  const {
    selectedConversationId,
    selectConversation,
    selectedConversation,
    setConversations,
  } = useConversationSelection();

  const { data: usersData } = useQuery<UsersData>(GET_USERS, {
    variables: { limit: 100, skip: 0 },
    fetchPolicy: 'network-only',
  });

  const members = usersData?.users ?? [];

  const handleConversationsLoaded = useCallback(
    (conversations: Conversation[]) => {
      setConversations(conversations);
    },
    [setConversations],
  );

  return (
    <div className="flex flex-1 h-full">
      <ConversationListPanel
        selectedConversationId={selectedConversationId}
        onSelectConversation={selectConversation}
        onConversationsLoaded={handleConversationsLoaded}
      />

      <div className="flex flex-1 h-full">
        {selectedConversationId && selectedConversation ? (
          <ChatPanel
            conversationId={selectedConversationId}
            conversationName={selectedConversation.name}
            members={members}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-chat-bg">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/5" />
              <p className="font-body text-sm text-text-muted">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
