import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import type { User } from '../../auth/hooks/useAuth';

interface GlobalTopBarProps {
  currentUser: User;
  onLogout: () => void;
}

export function GlobalTopBar({ currentUser, onLogout }: GlobalTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-end gap-4 border-b border-border bg-app-bg px-6">
      {/* Search */}
      <div className="flex h-[38px] w-36 items-center gap-2 rounded-lg bg-panel px-3">
        <Search size={14} className="shrink-0 text-text-muted" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted font-body outline-none"
        />
      </div>

      {/* Timezone */}
      <div className="flex items-center gap-1.5 text-text-dim text-sm font-body">
        <Globe size={15} />
        <span>{timeStr}</span>
      </div>

      {/* Icon buttons */}
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-secondary"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-secondary"
        aria-label="Help"
      >
        <HelpCircle size={18} />
      </button>

      {/* User avatar + dropdown */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-white/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {currentUser.name?.charAt(0).toUpperCase() ??
              currentUser.username.charAt(0).toUpperCase()}
          </div>
          <ChevronDown size={14} className="text-text-muted" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-dropdown py-1 shadow-lg">
            <div className="border-b border-border px-3 py-2">
              <p className="text-text-primary font-body text-sm font-medium">
                {currentUser.name}
              </p>
              <p className="text-text-muted font-body text-xs">
                @{currentUser.username}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="w-full px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-white/5 font-body"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
