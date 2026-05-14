import { Bell, MessageCircle, MessageCircleMore } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar/Avatar';
import type { TopBarProps } from './topbar.types';

export const TopBar = ({
  user,
  onMessageClick,
  onNotificationClick,
  unreadCount = 0,
  unreadNotificationCount = 0,
}: TopBarProps) => (
  <div className="flex items-center gap-4">
    <button
      type="button"
      onClick={onMessageClick}
      aria-label="Mensajes"
      className="relative grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-emerald-50 transition"
    >
      {unreadCount > 0 ? <MessageCircleMore className="size-5" /> : <MessageCircle className="size-5" />}
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold grid place-items-center shadow-md">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>

    <button
      type="button"
      onClick={onNotificationClick}
      aria-label="Notificaciones"
      className="relative grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-emerald-50 transition"
    >
      <Bell className="size-5" />
      {unreadNotificationCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold grid place-items-center shadow-md border-2 border-white">
          {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
        </span>
      )}
    </button>

    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <div className="text-sm font-extrabold text-(--fg)">{user.name}</div>
        <div className="text-xs text-(--fg-subtle)">@{user.handle}</div>
      </div>
      <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
    </div>
  </div>
);
