import { useTimeNow } from '@/shared/hooks/useTimeNow';
import { formatLastAccess } from '../utils/formatLastAccess';
import type { Participant } from '@/modules/course/domain/Participant';

type TeacherCardProps = {
  teacher: Participant;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const now = useTimeNow();
  const initials = teacher.fullName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-3xl border border-(--border) p-5">
      <div className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-3">
        👩‍🏫 Tu profesora
      </div>
      <div className="flex items-center gap-3">
        {teacher.avatarUrl ? (
          <img
            src={teacher.avatarUrl}
            alt={teacher.fullName}
            className="size-12 rounded-2xl object-cover shadow-sm"
          />
        ) : teacher.avatarUrlSmall ? (
          <img
            src={teacher.avatarUrlSmall}
            alt={teacher.fullName}
            className="size-12 rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-600 grid place-items-center text-white font-extrabold shadow-sm">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-(--fg) truncate">{teacher.fullName}</div>
          <div className="text-xs text-(--fg-muted)">
            {formatLastAccess(teacher.lastCourseAccess, now)}
          </div>
        </div>
      </div>
    </div>
  );
}
