interface UserListItemProps {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  title?: string | null;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
}

function UserAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  const initials = name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
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

export function UserListItem({
  id,
  name,
  username,
  avatarUrl,
  title,
  selected = false,
  disabled = false,
  onSelect,
  onClick,
}: UserListItemProps) {
  return (
    <div
      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors ${
        disabled
          ? 'cursor-default opacity-50'
          : 'cursor-pointer hover:bg-active-row'
      }`}
    >
      <div
        className="flex flex-1 items-center gap-3"
        onClick={() => !disabled && onClick?.(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.(id);
        }}
      >
        <UserAvatar name={name} avatarUrl={avatarUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-body text-sm font-medium text-text-primary">
            {name}
          </span>
          <span className="truncate font-body text-xs text-text-muted">
            @{username}
            {title ? ` \u00B7 ${title}` : ''}
          </span>
        </div>
      </div>

      {onSelect && !disabled && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          role="checkbox"
          aria-checked={selected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelect(id);
          }}
          className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors ${
            selected
              ? 'border-accent bg-accent'
              : 'border-border bg-transparent'
          }`}
        >
          {selected && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
