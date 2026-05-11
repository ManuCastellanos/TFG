import { isStudentRole } from '@/modules/user/domain/User';
import { getStudentColor } from '../../types/workspace.types';
import type { Participant } from '@/modules/course/domain/Participant';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

type Props = {
  participants: Participant[];
  progressByStudent: Record<string, number>;
};

export function TeacherClassRoster({ participants, progressByStudent }: Props) {
  const students = participants.filter((p) => isStudentRole(p.roleName));

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-(--fg)">Tu clase</h3>
        <span className="text-xs font-bold text-(--fg-subtle)">{students.length} alumnos</span>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-(--fg-muted) text-center py-4">Sin alumnos matriculados</p>
      ) : (
        <div className="flex flex-col gap-1">
          {students.slice(0, 6).map((s) => {
            const color = getStudentColor(parseInt(s.id, 10));
            const progress = progressByStudent[s.id] ?? 0;
            const initials = getInitials(s.fullName);
            return (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-(--tint-50)">
                <div
                  className={`size-9 rounded-xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold text-xs shrink-0`}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-(--fg) truncate">{s.fullName}</div>
                  <div className="h-1.5 rounded-full bg-neutral-100 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <span className="text-xs font-extrabold text-(--fg-muted) w-10 text-right shrink-0">{progress}%</span>
              </div>
            );
          })}
        </div>
      )}

      {students.length > 6 && (
        <button
          type="button"
          className="mt-3 w-full text-sm font-bold text-emerald-700 py-2 rounded-xl hover:bg-emerald-50 transition"
        >
          Ver todos
        </button>
      )}
    </div>
  );
}
