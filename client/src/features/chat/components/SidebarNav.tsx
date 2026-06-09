import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  MessageCircle,
  Heart,
  Users,
  Award,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: typeof MessageCircle;
  to?: string;
  disabled?: boolean;
  badge?: number;
  hasMention?: boolean;
  iconColor: string;
  iconBg: string;
}

interface SidebarNavProps {
  totalUnreadCount?: number;
  hasMention?: boolean;
}

function SidebarNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
            isActive
              ? 'bg-white/10 text-text-primary'
              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isActive ? 'bg-white/15' : ''
              }`}
              style={!isActive ? { backgroundColor: item.iconBg } : undefined}
            >
              <Icon
                size={20}
                style={!isActive ? { color: item.iconColor } : undefined}
                className={isActive ? 'text-text-primary' : ''}
              />
            </span>
            <span className="flex-1">{item.label}</span>
            {item.hasMention && (
              <span className="h-2 w-2 rounded-full bg-accent" />
            )}
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-unread px-1.5 text-[11px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-text-muted opacity-50"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: item.iconBg }}
      >
        <Icon size={20} style={{ color: item.iconColor }} />
      </span>
      <span className="flex-1 text-left">{item.label}</span>
    </button>
  );
}

export function SidebarNav({ totalUnreadCount = 0, hasMention = false }: SidebarNavProps) {
  const engageItems: NavItem[] = [
    { label: 'Forum', icon: MessageSquare, disabled: true, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.15)' },
    { label: 'Chat', icon: MessageCircle, to: '/', badge: totalUnreadCount > 0 ? totalUnreadCount : undefined, hasMention, iconColor: '#04B17D', iconBg: 'rgba(4,177,125,0.15)' },
    { label: 'Matches', icon: Heart, disabled: true, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.15)' },
  ];

  const peopleItems: NavItem[] = [
    { label: 'Members', icon: Users, to: '/members', iconColor: '#7B61FF', iconBg: 'rgba(123,97,255,0.15)' },
    { label: 'Contributors', icon: Award, disabled: true, iconColor: '#04B17D', iconBg: 'rgba(4,177,125,0.15)' },
  ];

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col bg-app-bg">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
          <span className="text-sm font-bold text-white">G</span>
        </div>
        <span className="text-text-primary font-body text-base font-semibold">
          Gradual Community
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {/* Engage section */}
        <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Engage
        </p>
        {engageItems.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-border" />

        {/* People section */}
        <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          People
        </p>
        {peopleItems.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom badge */}
      <div className="px-4 pb-4">
        <div className="flex h-[34px] items-center justify-center rounded-md border border-border text-text-muted text-xs font-medium">
          Powered by Gradual
        </div>
      </div>
    </aside>
  );
}
