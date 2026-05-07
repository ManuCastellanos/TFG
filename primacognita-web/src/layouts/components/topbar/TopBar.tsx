import { Bell, Mail } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar/Avatar';
import type { TopBarProps } from './topbar.types';

export const TopBar = ({ user, onMessageClick, onNotificationClick }: TopBarProps) => (
  <div className="flex items-center gap-4">
    <button
      type="button"
      onClick={onMessageClick}
      aria-label="Mensajes"
      className="grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-emerald-50 transition"
    >
      <Mail className="size-5" />
    </button>
    <button
      type="button"
      onClick={onNotificationClick}
      aria-label="Notificaciones"
      className="relative grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-emerald-50 transition"
    >
      <Bell className="size-5" />
      <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500" />
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
