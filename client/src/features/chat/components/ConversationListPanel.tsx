import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Search, MessageSquarePlus } from 'lucide-react';
import { GET_CONVERSATIONS } from '../graphql/chat.queries';
import { ConversationListItem } from './ConversationListItem';
import { CreateGroupConversationModal } from './CreateGroupConversationModal';

export interface Conversation {
  id: string;
  name: string;
  type: 'GROUP' | 'DIRECT';
  avatarUrls: string[];
  unreadCount: number;
  mentionCount: number;
  members: {
    id: string;
    name: string;
    username: string;
  }[];
  lastMessage: {
    id: string;
    body: string;
    sender: {
      id: string;
      name: string;
    };
    createdAt: string;
  } | null;
  updatedAt: string;
}

interface ConversationListPanelProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onConversationsLoaded: (conversations: Conversation[]) => void;
}

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConversationListPanel({
  selectedConversationId,
  onSelectConversation,
  onConversationsLoaded,
}: ConversationListPanelProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data, loading, error } = useQuery<{ conversations: Conversation[] }>(
    GET_CONVERSATIONS,
  );

  useEffect(() => {
    if (data?.conversations) {
      onConversationsLoaded(data.conversations);
    }
  }, [data, onConversationsLoaded]);

  const conversations = data?.conversations ?? [];

  const handleOpenCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const handleCreated = useCallback(() => {}, []);

  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col bg-panel border-r border-border">
      {/* Top action area */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        {/* Search input */}
        <div className="flex flex-1 items-center gap-2">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>

        {/* Create group button */}
        <button
          type="button"
          aria-label="Create group conversation"
          onClick={handleOpenCreateModal}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/10 hover:text-text-secondary"
        >
          <MessageSquarePlus size={18} />
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading && <PanelSkeleton />}

        {error && (
          <div className="flex items-center justify-center p-8">
            <p className="font-body text-sm text-unread">
              Failed to load conversations
            </p>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <p className="font-body text-sm text-text-muted">
              No conversations yet
            </p>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && (
          <div className="flex flex-col">
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onClick={onSelectConversation}
              />
            ))}
          </div>
        )}
      </div>
      <CreateGroupConversationModal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        onCreated={handleCreated}
      />
    </div>
  );
}
