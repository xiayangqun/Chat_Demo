import { useState, useRef, useCallback, useEffect } from 'react';
import {
  SendHorizontal,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Smile,
  Folder,
  AtSign,
} from 'lucide-react';
import { QuotePreview } from './QuotePreview';
import { MentionDropdown } from './MentionDropdown';
import { useMentions, type MentionUser } from '../hooks/useMentions';

const MAX_CHARS = 4000;

interface QuotedMessage {
  id: string;
  sender: { name: string };
  body: string;
}

interface MessageComposerProps {
  conversationId: string;
  quotedMessage: QuotedMessage | null;
  onClearQuote: () => void;
  members: MentionUser[];
  onSend: (input: {
    body: string;
    conversationId: string;
    quoteMessageId?: string;
    mentionUserIds: string[];
  }) => void;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Strikethrough, label: 'Strikethrough' },
  { icon: ListOrdered, label: 'Ordered list' },
  { icon: List, label: 'Unordered list' },
  { icon: Smile, label: 'Emoji' },
  { icon: Folder, label: 'File' },
  { icon: AtSign, label: 'Mention' },
] as const;

export function MessageComposer({
  conversationId,
  quotedMessage,
  onClearQuote,
  members,
  onSend,
}: MessageComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isOpen: mentionOpen,
    filteredMembers,
    visibleActiveIndex: activeIndex,
    selectedUserIds,
    handleInput: mentionHandleInput,
    handleKeyDown: mentionHandleKeyDown,
    insertMention,
    close: closeMention,
    reset: resetMentions,
  } = useMentions({ members });

  const charCount = value.length;
  const overLimit = charCount > MAX_CHARS;
  const canSend = value.trim().length > 0 && !overLimit;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = 200;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleSend = useCallback(() => {
    if (!canSend) return;

    const body = value.trim();
    onSend({
      body,
      conversationId,
      quoteMessageId: quotedMessage?.id,
      mentionUserIds: selectedUserIds,
    });
    setValue('');
    resetMentions();
  }, [
    canSend,
    value,
    onSend,
    conversationId,
    quotedMessage,
    selectedUserIds,
    resetMentions,
  ]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= MAX_CHARS + 100) {
        // Allow slight overtype for UX, but cap display
        setValue(newValue.slice(0, MAX_CHARS));
      }
      mentionHandleInput(newValue, e.target.selectionStart ?? newValue.length);
    },
    [mentionHandleInput],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current;
      const cursorPos = textarea?.selectionStart ?? value.length;

      // Let mention hook handle its keys first
      const mentionResult = mentionHandleKeyDown(e, value);
      if (mentionResult?.handled) {
        if (e.key === 'Enter' && filteredMembers.length > 0) {
          const user = filteredMembers[activeIndex];
          if (user) {
            const result = insertMention(user, value, cursorPos);
            setValue(result.newValue);
            // Restore cursor position after React re-render
            requestAnimationFrame(() => {
              const ta = textareaRef.current;
              if (ta) {
                ta.selectionStart = result.newCursorPos;
                ta.selectionEnd = result.newCursorPos;
              }
            });
          }
        }
        return;
      }

      // Enter to send (not Shift+Enter)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [
      value,
      mentionHandleKeyDown,
      filteredMembers,
      activeIndex,
      insertMention,
      handleSend,
    ],
  );

  const handleMentionSelect = useCallback(
    (user: MentionUser) => {
      const textarea = textareaRef.current;
      const cursorPos = textarea?.selectionStart ?? value.length;
      const result = insertMention(user, value, cursorPos);
      setValue(result.newValue);
      requestAnimationFrame(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.selectionStart = result.newCursorPos;
          ta.selectionEnd = result.newCursorPos;
          ta.focus();
        }
      });
    },
    [value, insertMention],
  );

  return (
    <div className="border-t border-border">
      {/* Quote preview */}
      {quotedMessage && (
        <QuotePreview
          authorName={quotedMessage.sender.name}
          body={quotedMessage.body}
          onClear={onClearQuote}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border px-3 py-1">
        {TOOLBAR_BUTTONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-border hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={label}
            title={`${label} (coming soon)`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative flex items-end gap-2 bg-input-bg px-3 py-2">
        {/* Mention dropdown */}
        {mentionOpen && (
          <MentionDropdown
            users={filteredMembers}
            activeIndex={activeIndex}
            onSelect={handleMentionSelect}
            onClose={closeMention}
          />
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="max-h-[200px] min-h-[40px] w-full resize-none bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />

        {/* Character count when approaching limit */}
        {charCount > MAX_CHARS - 200 && (
          <span
            className={`absolute bottom-2 right-14 text-xs ${
              overLimit ? 'text-unread' : 'text-text-muted'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        )}

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-app-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
