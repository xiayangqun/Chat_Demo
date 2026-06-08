import type { Conversation } from './ConversationListPanel';
import { useAuth } from '../../auth/hooks/useAuth';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: (id: string) => void;
}

function formatTimestamp(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 7) return `${diffDay}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatUnreadCount(count: number): string {
  if (count > 99) return '99+';
  return String(count);
}

function getDisplayName(conversation: Conversation, currentUserId: string | undefined): string {
  if (conversation.type !== 'DIRECT' || !currentUserId) {
    return conversation.name;
  }
  const otherUser = conversation.members.find((m) => m.id !== currentUserId);
  return otherUser?.name || conversation.name;
}

function AvatarCircle({ name, avatarUrls, unreadCount }: { name: string; avatarUrls: string[]; unreadCount: number }) {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hasAvatar = avatarUrls.length > 0 && avatarUrls[0];

  return (
    <div className="relative h-10 w-10 shrink-0">
      {hasAvatar ? (
        <img
          src={avatarUrls[0]}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {initials}
        </div>
      )}
      {unreadCount > 0 && (
        <div className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-unread px-1 text-[11px] font-semibold text-white">
          {formatUnreadCount(unreadCount)}
        </div>
      )}
    </div>
  );
}

export function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  const { user: currentUser } = useAuth();
  const displayName = getDisplayName(conversation, currentUser?.id);

  const lastMessagePreview = conversation.lastMessage
    ? `${conversation.lastMessage.sender.name}: ${conversation.lastMessage.body}`
    : 'No messages yet';

  const timestamp = conversation.lastMessage?.createdAt ?? conversation.updatedAt;

  return (
    <button
      type="button"
      onClick={() => onClick(conversation.id)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
        isSelected ? 'bg-active-row' : 'hover:bg-white/5'
      }`}
    >
      <AvatarCircle name={displayName} avatarUrls={conversation.avatarUrls} unreadCount={conversation.unreadCount} />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`truncate font-body text-sm font-medium ${
              isSelected ? 'text-text-primary' : 'text-text-secondary'
            }`}
          >
            {displayName}
          </span>
          <span className="shrink-0 font-body text-xs text-text-dim">
            {formatTimestamp(timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-body text-sm text-text-muted">
            {lastMessagePreview}
          </span>
          {conversation.mentionCount > 0 && (
            <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              mentioned you
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
