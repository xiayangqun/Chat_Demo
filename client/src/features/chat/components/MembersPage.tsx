import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { GET_USERS, GET_CONVERSATIONS } from '../graphql/chat.queries';
import { CREATE_DIRECT_CONVERSATION_MUTATION } from '../graphql/chat.mutations';
import { useAuth } from '../../auth/hooks/useAuth';
import { UserListItem } from './UserListItem';
import { CreateGroupConversationModal } from './CreateGroupConversationModal';

interface UserData {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
}

interface UsersData {
  users: UserData[];
}

interface DirectConversationData {
  createDirectConversation: {
    id: string;
  };
}

interface ConversationsData {
  conversations: Array<{
    id: string;
    name: string;
    type: string;
    avatarUrls: string[];
    unreadCount: number;
    lastMessage: {
      id: string;
      body: string;
      sender: { id: string; name: string };
      createdAt: string;
    } | null;
    updatedAt: string;
  }>;
}

export function MembersPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, refetch } = useQuery<UsersData>(GET_USERS, {
    variables: { query: searchQuery || undefined, limit: 100, skip: 0 },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [createDirectConversation] = useMutation<DirectConversationData>(
    CREATE_DIRECT_CONVERSATION_MUTATION,
    {
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.createDirectConversation) return;
        const newConv = mutationData.createDirectConversation;

        const existingData = cache.readQuery<ConversationsData>({
          query: GET_CONVERSATIONS,
        });

        if (existingData) {
          const alreadyExists = existingData.conversations.some(
            (c) => c.id === newConv.id,
          );
          if (!alreadyExists) {
            cache.writeQuery({
              query: GET_CONVERSATIONS,
              data: {
                conversations: [
                  {
                    ...newConv,
                    lastMessage: null,
                  } as ConversationsData['conversations'][0],
                  ...existingData.conversations,
                ],
              },
            });
          }
        }
      },
    },
  );

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    if (!currentUser) return users;
    return users.filter((u) => u.id !== currentUser.id);
  }, [users, currentUser]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleStartDirectChat = useCallback(
    async (userId: string) => {
      try {
        const { data: result } = await createDirectConversation({
          variables: { input: { userId } },
        });
        if (result?.createDirectConversation.id) {
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to create direct conversation:', err);
      }
    },
    [createDirectConversation, navigate],
  );

  const handleCreateGroup = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIds(new Set());
  };

  const preselectedUserIds = useMemo(() => Array.from(selectedIds), [selectedIds]);

  return (
    <div className="flex flex-1 flex-col bg-chat-bg">
      <div className="flex flex-col gap-4 border-b border-border bg-panel px-6 py-5">
        <div className="flex items-center justify-between">
          <h1 className="font-body text-xl font-bold text-text-primary">
            Members
          </h1>

          <button
            type="button"
            onClick={handleCreateGroup}
            disabled={selectedIds.size < 2}
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-body text-sm font-medium text-text-primary transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Users size={16} />
            <span>Create group chat</span>
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-input-bg px-3 py-2">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="h-3.5 w-48 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <p className="font-body text-sm text-text-muted">
              {searchQuery ? 'No members found' : 'No members yet'}
            </p>
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="flex flex-col">
            {filteredUsers.map((u) => (
              <UserListItem
                key={u.id}
                id={u.id}
                name={u.name}
                username={u.username}
                avatarUrl={u.avatarUrl}
                title={u.title}
                selected={selectedIds.has(u.id)}
                onSelect={handleSelect}
                onClick={handleStartDirectChat}
              />
            ))}
          </div>
        )}
      </div>

      <CreateGroupConversationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        preselectedUserIds={preselectedUserIds}
      />
    </div>
  );
}
