import { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MessageSender {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface MessageQuote {
  id: string;
  body: string;
  type: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export interface MessageMention {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  conversationId: string;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  sender: MessageSender;
  quoteMessage: MessageQuote | null;
  mentions: MessageMention[];
}

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Render body text, highlighting @mentions in accent color.
// We do a simple word-split: scan for @Name patterns that match a mention.
function renderBody(
  body: string,
  mentions: MessageMention[],
): React.ReactNode {
  if (mentions.length === 0) return body;

  // Build a regex that matches any @<mention.name>
  const escaped = mentions.map((m) =>
    m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const pattern = new RegExp(`@(${escaped.join('|')})`, 'g');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset lastIndex
  pattern.lastIndex = 0;

  while ((match = pattern.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${lastIndex}`}>{body.slice(lastIndex, match.index)}</span>,
      );
    }
    parts.push(
      <span key={`m-${match.index}`} className="text-accent font-medium">
        {match[0]}
      </span>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < body.length) {
    parts.push(<span key={`t-${lastIndex}`}>{body.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : body;
}

// ---------------------------------------------------------------------------
// Quote preview (compact, above the bubble)
// ---------------------------------------------------------------------------

function QuoteBlock({ quote }: { quote: MessageQuote }) {
  return (
    <div className="mb-1.5 flex items-start gap-2 rounded border-l-2 border-accent bg-white/5 px-2.5 py-1.5">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-accent">
          {quote.sender.name}
        </p>
        <p className="truncate text-xs text-text-muted">{quote.body}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({ sender }: { sender: MessageSender }) {
  const initials = sender.name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (sender.avatarUrl) {
    return (
      <img
        src={sender.avatarUrl}
        alt={sender.name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageItem
// ---------------------------------------------------------------------------

export function MessageItem({ message, currentUserId }: MessageItemProps) {
  const isMine = message.sender.id === currentUserId;
  const isMentioned = message.mentions.some((m) => m.id === currentUserId);

  const timeLabel = useMemo(() => formatTime(message.createdAt), [message.createdAt]);

  if (isMine) {
    return (
      <div className="flex w-full justify-end px-4 py-1.5">
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          {message.quoteMessage && <QuoteBlock quote={message.quoteMessage} />}
          <div className="rounded-2xl rounded-br-md bg-my-bubble px-3.5 py-2">
            <p className="break-words text-sm text-app-bg">
              {renderBody(message.body, message.mentions)}
            </p>
          </div>
          <span className="px-1 text-[11px] text-text-dim">{timeLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full items-start gap-2.5 px-4 py-1.5 ${isMentioned ? 'bg-accent/15 rounded-lg' : ''}`}>
      <Avatar sender={message.sender} />

      <div className="flex max-w-[75%] flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-text-secondary">
            {message.sender.name}
          </span>
          {isMentioned && (
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
              mentioned you
            </span>
          )}
          <span className="text-[11px] text-text-dim">{timeLabel}</span>
        </div>

        {message.quoteMessage && <QuoteBlock quote={message.quoteMessage} />}

        <div className={`rounded-2xl rounded-tl-md px-3.5 py-2 ${isMentioned ? 'bg-accent/30 ring-1 ring-accent' : 'bg-other-bubble'}`}>
          <p className="break-words text-sm text-text-primary">
            {renderBody(message.body, message.mentions)}
          </p>
        </div>
      </div>
    </div>
  );
}
