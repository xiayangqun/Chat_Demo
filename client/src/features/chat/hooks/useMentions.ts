import { useState, useCallback, useRef, useMemo } from 'react';

export interface MentionUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  title?: string | null;
}

interface UseMentionsOptions {
  members: MentionUser[];
}

interface UseMentionsReturn {
  isOpen: boolean;
  query: string;
  filteredMembers: MentionUser[];
  visibleActiveIndex: number;
  mentionStart: number;
  selectedUserIds: string[];
  handleInput: (value: string, cursorPos: number) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    value: string,
  ) => { handled: boolean; newValue?: string } | null;
  insertMention: (
    user: MentionUser,
    currentValue: string,
    cursorPos: number,
  ) => { newValue: string; newCursorPos: number };
  close: () => void;
  reset: () => void;
}

export function useMentions({
  members,
}: UseMentionsOptions): UseMentionsReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const mentionStartRef = useRef(-1);

  const WINDOW_SIZE = 5;

  const allFilteredMembers = useMemo(() => {
    if (!query) return members;
    const lower = query.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(lower));
  }, [members, query]);

  const visibleMembers = useMemo(() => {
    const start = Math.max(0, Math.min(activeIndex - WINDOW_SIZE + 1, allFilteredMembers.length - WINDOW_SIZE));
    return allFilteredMembers.slice(start, start + WINDOW_SIZE);
  }, [allFilteredMembers, activeIndex]);

  const visibleActiveIndex = activeIndex - Math.max(0, Math.min(activeIndex - WINDOW_SIZE + 1, allFilteredMembers.length - WINDOW_SIZE));

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    mentionStartRef.current = -1;
    setActiveIndex(0);
  }, []);

  const reset = useCallback(() => {
    setSelectedUserIds([]);
  }, []);

  const handleInput = useCallback(
    (value: string, cursorPos: number) => {
      const textBeforeCursor = value.slice(0, cursorPos);
      const atIndex = textBeforeCursor.lastIndexOf('@');

      if (atIndex === -1) {
        if (isOpen) close();
        return;
      }

      const afterAt = textBeforeCursor.slice(atIndex + 1);

      // No spaces allowed in the mention query
      if (/\s/.test(afterAt)) {
        if (isOpen) close();
        return;
      }

      // @ must be at start or preceded by whitespace
      if (atIndex > 0 && !/\s/.test(value[atIndex - 1])) {
        if (isOpen) close();
        return;
      }

      mentionStartRef.current = atIndex;
      setQuery(afterAt);
      setIsOpen(true);
      setActiveIndex(0);
    },
    [isOpen, close],
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLTextAreaElement>,
      _value: string,
    ): { handled: boolean; newValue?: string } | null => {
      if (!isOpen) return null;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < allFilteredMembers.length - 1 ? prev + 1 : 0,
        );
        return { handled: true };
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : allFilteredMembers.length - 1,
        );
        return { handled: true };
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return { handled: true };
      }

      if (e.key === 'Enter' && allFilteredMembers.length > 0) {
        e.preventDefault();
        return { handled: true };
      }

      return null;
    },
    [isOpen, allFilteredMembers, close],
  );

  const insertMention = useCallback(
    (
      user: MentionUser,
      currentValue: string,
      cursorPos: number,
    ): { newValue: string; newCursorPos: number } => {
      const start = mentionStartRef.current;
      if (start === -1) {
        return { newValue: currentValue, newCursorPos: cursorPos };
      }

      const before = currentValue.slice(0, start);
      const after = currentValue.slice(cursorPos);
      const mentionText = `@${user.name} `;
      const newValue = before + mentionText + after;
      const newCursorPos = start + mentionText.length;

      setSelectedUserIds((prev) =>
        prev.includes(user.id) ? prev : [...prev, user.id],
      );
      close();

      return { newValue, newCursorPos };
    },
    [close],
  );

  return {
    isOpen,
    query,
    filteredMembers: visibleMembers,
    visibleActiveIndex,
    mentionStart: mentionStartRef.current,
    selectedUserIds,
    handleInput,
    handleKeyDown,
    insertMention,
    close,
    reset,
  };
}
