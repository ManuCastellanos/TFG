import { useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { LoadingState } from '@/components/patterns/loadingState/LoadingState';
import { useSession } from '@/shared/hooks/useSession';
import { useQuizGrades } from '../hooks/useQuizGrades';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { StudentQuizAttemptStatus } from '@/modules/quiz/domain/StudentQuizAttempt';

const STATUS_META: Record<StudentQuizAttemptStatus, { label: string; pillClass: string; icon: string }> = {
  graded: { label: 'Calificado', pillClass: 'bg-emerald-100 text-emerald-800', icon: '⭐' },
  in_progress: { label: 'En curso', pillClass: 'bg-orange-100 text-orange-800', icon: '📝' },
  not_attempted: { label: 'Sin intentar', pillClass: 'bg-rose-100 text-rose-800', icon: '📭' },
};

function formatGrade(raw: string | null): string {
  if (!raw) return '—';
  const n = parseFloat(raw);
  return isNaN(n) ? '—' : n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function QuizGradesPage() {
  const { courseId, quizId: cmid } = useParams({ strict: false }) as { courseId: string; quizId: string };
  const { token } = useSession();
  const navigate = useNavigate();

  const { meta, students, loading, error } = useQuizGrades(token, courseId, cmid);

  const counts = useMemo(
    () => ({
      todos: students.length,
      graded: students.filter((s) => s.status === 'graded').length,
      in_progress: students.filter((s) => s.status === 'in_progress').length,
      not_attempted: students.filter((s) => s.status === 'not_attempted').length,
    }),
    [students],
  );

  if (loading) {
    return (
      <Page>
        <LoadingState label="Cargando notas…" className="py-8" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert variant="error">{error}</Alert>
      </Page>
    );
  }

  return (
    <Page>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="rounded-2xl bg-white border border-(--border) p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Alumnos</div>
          <div className="text-2xl font-extrabold text-(--fg) mt-1">{counts.todos}</div>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800/80">Calificados</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{counts.graded}</div>
        </div>
        <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-800/80">En curso</div>
          <div className="text-2xl font-extrabold text-orange-900 mt-1">{counts.in_progress}</div>
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800/80">Sin intentar</div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">{counts.not_attempted}</div>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState emoji="📭" title="No hay alumnos matriculados en este curso." />
      ) : (
        <div className="bg-white rounded-3xl border border-(--border) overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_100px_100px] gap-4 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) bg-(--tint-50) border-b border-(--border)">
            <span>Alumno</span>
            <span>Estado</span>
            <span>Intentos</span>
            <span className="text-right">Nota</span>
          </div>
          <div className="flex flex-col">
            {students.map((s) => {
              const color = SECTION_COLORS[s.colorIdx % SECTION_COLORS.length];
              const statusMeta = STATUS_META[s.status];
              const clickable = s.lastAttemptId != null;
              return (
                <button
                  key={s.userId}
                  type="button"
                  disabled={!clickable}
                  onClick={() =>
                    clickable &&
                    void navigate({
                      to: '/courses/$courseId/quiz/$quizId/review/$attemptId',
                      params: { courseId, quizId: cmid, attemptId: String(s.lastAttemptId) },
                    })
                  }
                  className={`grid grid-cols-[1fr_140px_100px_100px] gap-4 items-center px-5 py-3 text-left border-b border-(--border) last:border-0 transition ${
                    clickable ? 'hover:bg-(--tint-50)' : 'opacity-70 cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AvatarBox gradient={color.grad} size="size-9" radius="rounded-xl">
                      {s.userInitials}
                    </AvatarBox>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-(--fg) truncate">{s.userFullName}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 w-fit flex items-center gap-1 ${statusMeta.pillClass}`}
                  >
                    <span>{statusMeta.icon}</span>
                    {statusMeta.label}
                  </span>
                  <span className="text-xs text-(--fg-muted) font-bold">{s.attemptsCount}</span>
                  <span className="text-right font-extrabold text-(--fg)">
                    {formatGrade(s.bestGrade)}
                    {s.bestGrade != null && meta && (
                      <span className="text-xs font-bold text-(--fg-subtle)">
                        {' '}
                        / {meta.gradeMax.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Page>
  );
}
