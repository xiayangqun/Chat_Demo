import { useState, useCallback, useMemo, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import type { Conversation } from '../components/ConversationListPanel';
import { MARK_CONVERSATION_READ } from '../graphql/chat.mutations';
import { setCurrentConversationId } from './useChatSocket';

export interface UseConversationSelectionReturn {
  selectedConversationId: string | null;
  selectConversation: (id: string) => void;
  selectedConversation: Conversation | undefined;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  initialUnreadCount: number;
}

export function useConversationSelection(): UseConversationSelectionReturn {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [initialUnreadCount, setInitialUnreadCount] = useState(0);
  const client = useApolloClient();

  useEffect(() => {
    return () => {
      setCurrentConversationId(null);
    };
  }, []);

  const selectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setCurrentConversationId(id);

    // Capture unreadCount before clearing it
    setConversations((prev) => {
      const conv = prev.find((c) => c.id === id);
      setInitialUnreadCount(conv?.unreadCount ?? 0);
      return prev.map((c) =>
        c.id === id ? { ...c, unreadCount: 0, mentionCount: 0 } : c,
      );
    });

    // Fire markConversationRead mutation (optimistic response handled by Apollo)
    client.mutate({
      mutation: MARK_CONVERSATION_READ,
      variables: { conversationId: id },
      optimisticResponse: {
        markConversationRead: {
          __typename: 'Conversation',
          id,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      },
    }).catch((err) => {
      console.warn('[useConversationSelection] markConversationRead failed:', err);
    });
  }, [client]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  return useMemo(
    () => ({
      selectedConversationId,
      selectConversation,
      selectedConversation,
      conversations,
      setConversations,
      initialUnreadCount,
    }),
    [selectedConversationId, selectConversation, selectedConversation, conversations, setConversations, initialUnreadCount],
  );
}
