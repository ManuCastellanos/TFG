import { ChevronRight } from 'lucide-react';
import { getModuleMeta, getStudentColor } from '../../../../utils/workspace-mappers';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { formatRelativeDate } from '@/shared/utils/formatRelativeDate';
import type { EnrichedPendingItem } from '../hooks/useTeacherPending';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

function badgeForItem(item: EnrichedPendingItem): { label: string; cx: string } {
  if (item.subKind === 'manual') return { label: 'Rev. manual', cx: 'bg-amber-100 text-amber-800' };
  if (item.subKind === 'resubmit') return { label: 'Reenvío', cx: 'bg-violet-100 text-violet-800' };
  return { label: 'Sin corregir', cx: 'bg-orange-100 text-orange-800' };
}

type Props = {
  item: EnrichedPendingItem;
  onClick: () => void;
};

export function PendingRow({ item, onClick }: Props) {
  const meta = getModuleMeta(item.activityKind);
  const studentColor = getStudentColor(item.userId);
  const badge = badgeForItem(item);
  const initials = getInitials(item.userName);
  const when = item.submittedAt > 0 ? formatRelativeDate(item.submittedAt) : '—';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3.5 rounded-2xl bg-white border ${
        item.urgent ? 'border-rose-200 ring-1 ring-rose-100' : 'border-(--border)'
      } hover:border-emerald-300 hover:shadow-sm transition text-left`}
    >
      <div className={`size-11 rounded-2xl ${meta.soft} grid place-items-center text-xl shrink-0`}>
        {meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">
            {meta.label}
          </span>
          {item.topic && (
            <>
              <span className="text-(--fg-subtle)">·</span>
              <span className="text-[11px] font-bold text-(--fg-muted)">{item.topic}</span>
            </>
          )}
          {item.urgent && (
            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 rounded-full px-2 py-0.5">
              vence hoy
            </span>
          )}
        </div>
        <div className="font-extrabold text-(--fg) leading-tight truncate">{item.activityName}</div>
        {item.detail && <div className="text-xs text-(--fg-muted) mt-0.5 truncate">{item.detail}</div>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <AvatarBox gradient={studentColor.grad} size="size-9" radius="rounded-xl" className="text-[11px]">
            {initials}
          </AvatarBox>
          <div className="leading-tight">
            <div className="font-extrabold text-sm text-(--fg)">{item.userName}</div>
            <div className="text-[11px] text-(--fg-subtle) font-bold">{when}</div>
          </div>
        </div>
        <span className={`text-[10px] font-extrabold rounded-full px-2.5 py-1 ${badge.cx}`}>
          {badge.label}
        </span>
        <ChevronRight className="size-4 text-(--fg-muted)" />
      </div>
    </button>
  );
}
