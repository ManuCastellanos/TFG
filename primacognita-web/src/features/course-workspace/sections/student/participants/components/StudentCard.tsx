import { useTimeNow } from '@/shared/hooks/useTimeNow';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import { formatLastAccess } from '../utils/formatLastAccess';
import { useChatDrawer } from '@/features/chat/useChatDrawer';
import type { Participant } from '@/modules/course/domain/Participant';

type StudentCardProps = {
  student: Participant;
  isCurrentUser: boolean;
};

export function StudentCard({ student, isCurrentUser }: StudentCardProps) {
  const now = useTimeNow();
  const { openWithUser } = useChatDrawer();
  const colorIdx = Number(student.id) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];
  const initials = student.fullName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const access = formatLastAccess(student.lastCourseAccess, now);
  const isOnline = access === 'online';

  return (
    <div
      className={`p-4 rounded-2xl border bg-white text-center ${
        isCurrentUser ? 'border-emerald-300 bg-emerald-50/40' : 'border-(--border)'
      }`}
    >
      <div className="relative size-14 mx-auto mb-3">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            className="size-14 rounded-2xl object-cover shadow-sm"
          />
        ) : student.avatarUrlSmall ? (
          <img
            src={student.avatarUrlSmall}
            alt={student.fullName}
            className="size-14 rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <div
            className={`size-14 rounded-2xl bg-linear-to-br ${color.grad} grid place-items-center text-white font-extrabold shadow-sm`}
          >
            {initials}
          </div>
        )}
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-400 border-2 border-white" />
        )}
      </div>
      <div className="font-extrabold text-base text-(--fg) leading-tight">
        {student.fullName}
        {isCurrentUser && <span className="text-emerald-700"> (tú)</span>}
      </div>
      <div className="text-[10px] font-bold uppercase text-(--fg-subtle) mt-0.5">
        {isOnline ? 'En línea' : access}
      </div>
      {!isCurrentUser && (
        <button
          type="button"
          onClick={() => openWithUser(Number(student.id))}
          className="mt-3 w-full text-xs font-extrabold py-2 rounded-xl bg-(--tint-50) hover:bg-emerald-100 text-(--fg-muted) hover:text-emerald-800 transition"
        >
          💬 Mensaje
        </button>
      )}
    </div>
  );
}
