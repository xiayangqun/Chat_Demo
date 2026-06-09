import { Users } from 'lucide-react';

interface ChatHeaderProps {
  conversationName: string;
  memberCount?: number;
}

export function ChatHeader({ conversationName, memberCount }: ChatHeaderProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-chat-bg px-5">
      {/* Left: conversation title */}
      <h2 className="truncate font-body text-base font-semibold text-text-primary">
        {conversationName}
      </h2>

      {/* Right: member count pill */}
      {memberCount != null && memberCount > 0 && (
        <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
          <Users size={14} className="text-text-muted" />
          <span className="font-body text-xs text-text-muted">
            {memberCount}
          </span>
        </div>
      )}
    </div>
  );
}
