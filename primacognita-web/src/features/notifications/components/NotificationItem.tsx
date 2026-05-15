import { useNavigate, useParams } from '@tanstack/react-router';
import type { Notification, NotificationType } from '@/modules/notifications/domain/Notification';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { useTimeNow } from '@/shared/hooks/useTimeNow';

const TYPE_META: Record<NotificationType, { emoji: string; tone: string }> = {
  assignment: { emoji: '📝', tone: 'bg-violet-100 text-violet-700' },
  message:    { emoji: '💬', tone: 'bg-sky-100 text-sky-700' },
  badge:      { emoji: '🏆', tone: 'bg-amber-100 text-amber-700' },
  graded:     { emoji: '✅', tone: 'bg-emerald-100 text-emerald-700' },
  forum:      { emoji: '📣', tone: 'bg-pink-100 text-pink-700' },
  system:     { emoji: 'ℹ️', tone: 'bg-neutral-100 text-neutral-700' },
};

function formatWhen(timecreated: number, now: number): string {
  const diff = now - timecreated * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
}

function extractCmid(contexturl?: string | null): string | null {
  if (!contexturl) return null;
  const match = contexturl.match(/[?&]id=(\d+)/);
  return match ? match[1] : null;
}

export function NotificationItem({ n }: { n: Notification }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as Record<string, string>;
  const currentCourseId = params.id;
  const meta = TYPE_META[n.type];
  const markRead = useMarkNotificationRead();
  const now = useTimeNow();
  const cmid = extractCmid(n.contexturl);

  const handleClick = () => {
    if (!n.read) markRead.mutate(n.id);
    if (!currentCourseId || !cmid) return;

    if (n.component === 'mod_assign' || n.type === 'graded' || n.type === 'assignment') {
      navigate({ to: '/courses/$courseId/assignment/$cmid', params: { courseId: currentCourseId, cmid } });
    } else if (n.component === 'mod_quiz') {
      navigate({ to: '/courses/$courseId/quiz/$cmid', params: { courseId: currentCourseId, cmid } });
    } else {
      navigate({ to: '/courses/$courseId', params: { id: currentCourseId } });
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`relative flex items-start gap-3 p-4 rounded-2xl border transition cursor-pointer outline-none
        ${n.read
          ? 'bg-white border-(--border) hover:bg-(--tint-50)'
          : 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/70'}`}
    >
      {!n.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 size-2 rounded-full bg-emerald-500" />
      )}
      <div className={`size-11 rounded-2xl grid place-items-center text-xl shrink-0 ${meta.tone}`}>
        {meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          {n.userfromfullname && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">
              {n.userfromfullname}
            </span>
          )}
          <span className="text-[10px] font-bold text-(--fg-subtle)">{formatWhen(n.timecreated, now)}</span>
        </div>
        <div className={`text-sm leading-snug ${n.read ? 'font-bold text-(--fg)' : 'font-extrabold text-(--fg)'}`}>
          {n.title}
        </div>
        <div className="text-xs text-(--fg-muted) leading-relaxed mt-1 line-clamp-2">
          {n.body}
        </div>
        {n.contexturl && (
          <span className={`mt-2.5 inline-flex items-center text-xs font-extrabold rounded-xl px-3 py-1.5
            ${n.read
              ? 'bg-(--tint-50) text-(--fg) border border-(--border)'
              : 'bg-[#274E38] text-white'}`}>
            Ver →
          </span>
        )}
      </div>
    </div>
  );
}
