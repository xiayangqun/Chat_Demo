import { useRef, useEffect } from 'react';
import { MessageItem, type Message } from './MessageItem';

export type { Message } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-chat-bg">
        <p className="font-body text-sm text-text-muted">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-chat-bg">
      <div className="flex flex-1" />
      {/* Messages aligned to bottom */}
      <div className="flex flex-col pb-2">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
