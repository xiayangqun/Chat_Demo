import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { X, Search, XCircle } from 'lucide-react';
import { GET_USERS, GET_CONVERSATIONS } from '../graphql/chat.queries';
import { CREATE_GROUP_CONVERSATION_MUTATION } from '../graphql/chat.mutations';
import { useAuthContext } from '../../auth/components/AuthGate';
import type { Conversation } from './ConversationListPanel';

interface UsersQueryData {
  users: Array<{
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    title: string | null;
  }>;
}

interface CreateGroupConversationData {
  createGroupConversation: {
    id: string;
    name: string;
    type: 'GROUP' | 'DIRECT';
    avatarUrls: string[];
    memberCount: number;
    unreadCount: number;
    lastMessage: {
      id: string;
      body: string;
      createdAt: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface CreateGroupConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (conversationId: string) => void;
  preselectedUserIds?: string[];
}

function validateGroupName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Group name is required';
  if (trimmed.length > 60) return 'Group name must be 60 characters or less';
  return null;
}

function UserAvatar({ user }: { user: { name: string; avatarUrl: string | null } }) {
  const initials = user.name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export function CreateGroupConversationModal({
  isOpen,
  onClose,
  onCreated,
  preselectedUserIds = [],
}: CreateGroupConversationModalProps) {
  const { user: currentUser } = useAuthContext();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(preselectedUserIds);

  const { data: usersData, loading: usersLoading } = useQuery<UsersQueryData>(
    GET_USERS,
    { variables: { query: searchQuery } },
  );

  const [createGroupConversation, { loading: creating }] =
    useMutation<CreateGroupConversationData>(CREATE_GROUP_CONVERSATION_MUTATION);

  const availableUsers = useMemo(() => {
    if (!usersData?.users || !currentUser) return [];
    return usersData.users.filter((u) => u.id !== currentUser.id);
  }, [usersData?.users, currentUser]);

  const selectedUsers = useMemo(
    () => availableUsers.filter((u) => selectedUserIds.includes(u.id)),
    [availableUsers, selectedUserIds],
  );

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;
    const q = searchQuery.toLowerCase();
    return availableUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [availableUsers, searchQuery]);

  const nameError = groupName.trim().length > 0 ? validateGroupName(groupName) : null;
  const canCreate =
    groupName.trim().length > 0 &&
    selectedUserIds.length > 0 &&
    !creating &&
    nameError === null;

  const handleToggleUser = useCallback(
    (userId: string) => {
      setSelectedUserIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    },
    [],
  );

  const handleRemoveUser = useCallback((userId: string) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!canCreate) return;

    const error = validateGroupName(groupName);
    if (error) return;

    try {
      const { data } = await createGroupConversation({
        variables: {
          input: {
            name: groupName.trim(),
            memberUserIds: selectedUserIds,
          },
        },
        update: (cache, { data: mutationData }) => {
          if (!mutationData?.createGroupConversation) return;

          const newConversation = mutationData.createGroupConversation;

          // Prepend the new conversation to the GET_CONVERSATIONS cache
          const existingData = cache.readQuery<{ conversations: Conversation[] }>({
            query: GET_CONVERSATIONS,
          });

          if (existingData) {
            cache.writeQuery({
              query: GET_CONVERSATIONS,
              data: {
                conversations: [
                  {
                    ...newConversation,
                    lastMessage: newConversation.lastMessage ?? null,
                    members: [],
                  } as unknown as Conversation,
                  ...existingData.conversations,
                ],
              },
            });
          }
        },
      });

      if (data?.createGroupConversation) {
        const newId = data.createGroupConversation.id;
        onClose();
        onCreated?.(newId);
        navigate('/');
      }
    } catch {
      // Error is handled by Apollo error state, but we let the component re-render
    }
  }, [
    canCreate,
    groupName,
    selectedUserIds,
    createGroupConversation,
    onClose,
    onCreated,
    navigate,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen && groupName === '') {
      const input = modalRef.current?.querySelector<HTMLInputElement>('#group-name-input');
      requestAnimationFrame(() => input?.focus());
    }
  }, [isOpen, groupName]);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setSearchQuery('');
      setSelectedUserIds(preselectedUserIds);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-modal-title"
    >
      <div
        ref={modalRef}
        className="flex w-[480px] max-w-[90vw] flex-col rounded-lg border border-border bg-panel shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="create-group-modal-title"
            className="font-body text-base font-bold text-text-primary"
          >
            New Group Chat
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/10 hover:text-text-secondary"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="group-name-input"
              className="font-body text-xs font-medium text-text-secondary"
            >
              Group name
            </label>
            <input
              id="group-name-input"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              maxLength={60}
              className="rounded-md border border-border bg-input-bg px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
            {groupName.trim().length > 0 && nameError && (
              <p className="font-body text-xs text-unread">{nameError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-body text-xs font-medium text-text-secondary">
              Add members
            </p>

            <div className="flex items-center gap-2 rounded-md border border-border bg-input-bg px-3 py-2">
              <Search size={14} className="shrink-0 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members"
                className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="flex items-center gap-1 rounded-full bg-dropdown px-2.5 py-1 font-body text-xs text-text-primary"
                  >
                    {user.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-0.5 flex items-center text-text-muted transition-colors hover:text-unread"
                      aria-label={`Remove ${user.name}`}
                    >
                      <XCircle size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex max-h-64 flex-col overflow-y-auto rounded-md border border-border">
              {usersLoading && (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
                </div>
              )}

              {!usersLoading && filteredUsers.length === 0 && (
                <div className="flex items-center justify-center py-6">
                  <p className="font-body text-sm text-text-muted">
                    {searchQuery ? 'No users found' : 'No other users available'}
                  </p>
                </div>
              )}

              {!usersLoading &&
                filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleToggleUser(user.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-active-row' : 'hover:bg-white/5'
                      }`}
                    >
                      <UserAvatar user={user} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-body text-sm font-medium text-text-primary">
                          {user.name}
                        </span>
                        <span className="truncate font-body text-xs text-text-muted">
                          @{user.username}
                        </span>
                      </div>
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-transparent'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 font-body text-sm font-medium text-text-primary transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!canCreate}
            className="rounded-md bg-accent px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
