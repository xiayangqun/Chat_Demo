import { useCallback, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { ChevronDown } from 'lucide-react';
import { MessageItem, type Message } from './MessageItem';

export type { Message } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  initialUnreadCount: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export function MessageList({
  messages,
  currentUserId,
  initialUnreadCount,
  hasMore,
  loadingMore,
  onLoadMore,
}: MessageListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const atBottomRef = useRef(true);
  const initialUnreadHandledRef = useRef(false);
  const firstMsgIdRef = useRef<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Reset on conversation switch
  if (messages.length > 0 && firstMsgIdRef.current !== messages[0].id) {
    firstMsgIdRef.current = messages[0].id;
    initialUnreadHandledRef.current = false;
  }

  // Compute initial scroll index: last message (bottom) or first unread
  const getInitialIndex = () => {
    if (messages.length === 0) return 0;
    if (!initialUnreadHandledRef.current && initialUnreadCount > 0 && initialUnreadCount <= messages.length) {
      initialUnreadHandledRef.current = true;
      return { index: messages.length - initialUnreadCount, align: 'start' as const };
    }
    initialUnreadHandledRef.current = true;
    return { index: messages.length - 1, align: 'end' as const };
  };

  // Auto-scroll: follow new messages only when at bottom or own message
  const followOutput = useCallback(
    (isAtBottom: boolean) => {
      const lastMsg = messages[messages.length - 1];
      const isOwnMessage = lastMsg?.sender.id === currentUserId;
      if (isAtBottom || isOwnMessage) {
        return 'smooth';
      }
      setShowScrollButton(true);
      return false;
    },
    [messages, currentUserId],
  );

  const atBottomStateChange = useCallback((atBottom: boolean) => {
    atBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);

  const startReached = useCallback(() => {
    if (hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [hasMore, loadingMore, onLoadMore]);

  const handleScrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-chat-bg">
        <p className="font-body text-sm text-text-muted">No messages yet</p>
      </div>
    );
  }

  const initialItem = getInitialIndex();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <Virtuoso
        key={firstMsgIdRef.current ?? 'empty'}
        ref={virtuosoRef}
        data={messages}
        initialTopMostItemIndex={initialItem}
        followOutput={followOutput}
        atBottomStateChange={atBottomStateChange}
        startReached={startReached}
        overscan={200}
        itemContent={(_index, msg) => (
          <MessageItem message={msg} currentUserId={currentUserId} />
        )}
        components={{
          Header: () =>
            loadingMore ? (
              <div className="flex items-center justify-center py-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
              </div>
            ) : null,
        }}
      />

      {showScrollButton && (
        <button
          type="button"
          onClick={handleScrollToBottom}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent shadow-lg transition-opacity hover:opacity-90"
        >
          <ChevronDown size={18} className="text-white" />
        </button>
      )}
    </div>
  );
}
