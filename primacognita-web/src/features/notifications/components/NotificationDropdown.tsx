import { useRef, useState } from 'react';
import { Bell, Settings, ChevronRight } from 'lucide-react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useNotificationDrawer } from '../notificationContext';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/modules/notifications/domain/Notification';

type TabId = 'all' | 'task' | 'badge';

const TABS: { id: TabId; label: string; filter: (n: Notification) => boolean }[] = [
  { id: 'all',   label: 'Todas',    filter: (n) => n.type !== 'message' },
  { id: 'task',  label: 'Tareas',   filter: (n) => n.type === 'assignment' || n.type === 'graded' },
  { id: 'badge', label: 'Logros',   filter: (n) => n.type === 'badge' },
];

export function NotificationDropdown() {
  const { isOpen, close } = useNotificationDrawer();
  const [tab, setTab] = useState<TabId>('all');
  const { notifications, unreadCount, isLoading, isError, errorMessage } = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const now = useTimeNow();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) close();
  });

  const activeTab = TABS.find((t) => t.id === tab)!;
  const filtered = notifications.filter(activeTab.filter);

  const counts = TABS.reduce<Record<TabId, number>>((acc, t) => {
    acc[t.id] = notifications.filter((n) => !n.read && t.filter(n)).length;
    return acc;
  }, {} as Record<TabId, number>);

  const fresh = filtered.filter((n) => {
    const diff = now - n.timecreated * 1000;
    return diff < 24 * 60 * 60 * 1000;
  });
  const older = filtered.filter((n) => {
    const diff = now - n.timecreated * 1000;
    return diff >= 24 * 60 * 60 * 1000;
  });

  return (
    <div
      ref={dropdownRef}
      className={`fixed right-8 top-22 z-40 w-105 bg-(--tint-100) border border-(--border)
        rounded-3xl shadow-2xl flex flex-col overflow-hidden
        transition-all duration-200 origin-top
        ${isOpen
          ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}
      style={{ maxHeight: 'calc(100vh - 104px)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 bg-white border-b border-(--border) shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="size-10 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-lg">
            <Bell className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-(--fg) leading-tight">Notificaciones</h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-rose-500 text-white rounded-full px-2 py-0.5">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 mt-0.5 disabled:opacity-50"
                disabled={markAll.isPending}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-3 -mx-1 px-1 overflow-x-auto">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            const count = counts[t.id];
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition
                  ${isActive
                    ? 'bg-[#274E38] text-white'
                    : 'text-(--fg-muted) hover:bg-(--tint-50)'}`}
              >
                {t.label}
                {count > 0 && (
                  <span className={`text-[10px] font-extrabold rounded-full px-1.5 py-0.5 leading-none
                    ${isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
        {isLoading ? (
          <div className="flex-1 grid place-items-center py-12">
            <div className="size-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="grid place-items-center text-center px-6 py-12">
            <div className="size-20 mx-auto rounded-3xl bg-rose-50 grid place-items-center text-4xl mb-4">
              ⚠️
            </div>
            <div className="font-extrabold text-(--fg) mb-1">No se pudieron cargar</div>
            <div className="text-xs text-(--fg-muted) font-bold max-w-70 wrap-break-word">
              {errorMessage ?? 'Error al conectar con el servidor.'}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center text-center px-6 py-12">
            <div className="size-20 mx-auto rounded-3xl bg-emerald-50 grid place-items-center text-4xl mb-4">
              🎉
            </div>
            <div className="font-extrabold text-(--fg) mb-1">¡Todo al día!</div>
            <div className="text-xs text-(--fg-muted) font-bold">
              No tienes notificaciones en esta sección.
            </div>
          </div>
        ) : (
          <>
            {fresh.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-1">
                  Recientes
                </div>
                {fresh.map((n) => <NotificationItem key={n.id} n={n} />)}
              </div>
            )}
            {older.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-1">
                  Anteriores
                </div>
                {older.map((n) => <NotificationItem key={n.id} n={n} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-white border-t border-(--border) flex items-center justify-between shrink-0">
        <button className="text-xs font-extrabold text-(--fg-muted) hover:text-(--fg) flex items-center gap-1.5">
          <Settings className="size-4" />
          Preferencias
        </button>
        <button className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
          Ver todas
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
