import { useRef, useEffect, useCallback, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MessageItem, type Message } from './MessageItem';

export type { Message } from './MessageItem';

const NEAR_BOTTOM_THRESHOLD = 150;
const LOAD_MORE_THRESHOLD = 100;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const prevLengthRef = useRef(0);
  const firstMsgIdRef = useRef<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Track whether user is near the bottom
  const isNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle scroll events: detect near-bottom state + trigger load more
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    setShowScrollButton(!isNearBottom());

    // Load older messages when scrolled near top
    if (el.scrollTop < LOAD_MORE_THRESHOLD && hasMore && !loadingMore) {
      const prevScrollHeight = el.scrollHeight;
      onLoadMore();

      // Preserve scroll position after new messages are prepended.
      // Use a MutationObserver to detect when the DOM updates.
      const observer = new MutationObserver(() => {
        const newScrollHeight = el.scrollHeight;
        if (newScrollHeight !== prevScrollHeight) {
          el.scrollTop += newScrollHeight - prevScrollHeight;
          observer.disconnect();
        }
      });
      observer.observe(el, { childList: true, subtree: true });

      // Safety disconnect after 2s in case DOM doesn't change
      setTimeout(() => observer.disconnect(), 2000);
    }
  }, [hasMore, loadingMore, onLoadMore, isNearBottom]);

  // Initial scroll behavior
  useEffect(() => {
    if (messages.length === 0) return;

    // Detect conversation switch: first message ID changed
    const currentFirstId = messages[0].id;
    if (firstMsgIdRef.current !== currentFirstId) {
      firstMsgIdRef.current = currentFirstId;
      isInitialLoadRef.current = true;
      setShowScrollButton(false);
    }

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevLengthRef.current = messages.length;

      if (initialUnreadCount > 0 && initialUnreadCount <= messages.length) {
        // Scroll to first unread message (instant, no animation)
        const targetIndex = messages.length - initialUnreadCount;
        const targetEl = containerRef.current?.querySelector(
          `[data-index="${targetIndex}"]`,
        );
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
          setShowScrollButton(!isNearBottom());
          return;
        }
      }

      // No unread or unread > loaded count: scroll to bottom
      scrollToBottom('auto');
      return;
    }

    // Subsequent updates: new messages were appended
    const lengthIncreased = messages.length > prevLengthRef.current;
    prevLengthRef.current = messages.length;

    if (lengthIncreased) {
      const lastMessage = messages[messages.length - 1];
      const isOwnMessage = lastMessage?.sender.id === currentUserId;
      if (isOwnMessage || isNearBottom()) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, currentUserId, initialUnreadCount, isNearBottom, scrollToBottom]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-chat-bg">
        <p className="font-body text-sm text-text-muted">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col overflow-y-auto bg-chat-bg"
      >
        {loadingMore && (
          <div className="flex items-center justify-center py-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
          </div>
        )}
        <div className="flex flex-1" />
        <div className="flex flex-col pb-2">
          {messages.map((msg, i) => (
            <div key={msg.id} data-index={i}>
              <MessageItem
                message={msg}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent shadow-lg transition-opacity hover:opacity-90"
        >
          <ChevronDown size={18} className="text-white" />
        </button>
      )}
    </div>
  );
}
