import { useEffect, useRef } from 'react';

interface MentionUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  title?: string | null;
}

interface MentionDropdownProps {
  users: MentionUser[];
  activeIndex: number;
  onSelect: (user: MentionUser) => void;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MentionDropdown({
  users,
  activeIndex,
  onSelect,
  onClose,
}: MentionDropdownProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (users.length === 0) return null;

  return (
    <div
      ref={listRef}
      className="absolute bottom-full left-0 z-50 mb-1 w-[260px] overflow-hidden rounded-md bg-dropdown shadow-lg"
    >
      {users.map((user, index) => (
        <div
          key={user.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
            index === activeIndex
              ? 'bg-active-row'
              : 'hover:bg-active-row'
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border text-xs font-medium text-text-secondary">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {user.name}
            </p>
            {user.title && (
              <p className="truncate text-xs text-text-muted">{user.title}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
