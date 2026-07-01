import { Plus } from 'lucide-react';
import { useSession } from '@/shared/hooks/useSession';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { Button } from '@/components/ui/button/Button';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import { GradeCell } from './components/GradeCell';
import { DistributionChart } from './components/DistributionChart';
import { useTeacherGradebook } from './hooks/useTeacherGradebook';
import { formatGrade } from './utils/gradeColor';

type Props = {
  courseId: string;
  sections: CourseSection[];
  participants: Participant[];
  assignments: { id: number; cmId: number; title: string; maxGrade: number }[];
  gradesByAssign: Record<number, GradeEntry[]>;
};

const TREND_ICON: Record<'up' | 'down' | 'flat', string> = {
  up: '↗︎',
  down: '↘︎',
  flat: '→',
};

const TREND_CX: Record<'up' | 'down' | 'flat', string> = {
  up: 'text-emerald-700',
  down: 'text-rose-700',
  flat: 'text-(--fg-muted)',
};

export function TeacherGradebookView({
  courseId,
  sections,
  participants,
  assignments,
  gradesByAssign,
}: Props) {
  const { token } = useSession();
  const data = useTeacherGradebook({
    token,
    courseId,
    sections,
    participants,
    assignments,
    gradesByAssign,
  });

  if (data.rows.length === 0) {
    return (
      <EmptyState
        emoji="📊"
        title="Sin alumnos"
        subtitle="Aún no hay alumnos matriculados en este curso."
      />
    );
  }

  if (data.topics.length === 0) {
    return (
      <EmptyState
        emoji="📚"
        title="Sin temas calificables"
        subtitle="Aún no hay temas con actividades evaluables en este curso."
      />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-(--fg)">Libro de notas</h2>
            <p className="text-sm text-(--fg-muted)">Vista de todas las calificaciones del curso.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-2 rounded-2xl bg-white border border-(--border) text-(--fg-muted) text-xs font-extrabold hover:bg-(--tint-50) flex items-center gap-1.5"
            >
              🔍 Filtrar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-2 rounded-2xl bg-white border border-(--border) text-(--fg-muted) text-xs font-extrabold hover:bg-(--tint-50)"
            >
              ⇣ Exportar CSV
            </Button>
            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5"
            >
              <Plus className="size-3.5" /> Nueva columna
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-(--border) overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-(--tint-50) border-b border-(--border)">
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-4 py-3 sticky left-0 bg-(--tint-50) z-10 min-w-[200px]">
                    Alumno
                  </th>
                  {data.topics.map((topic) => (
                    <th
                      key={topic.sectionId}
                      className="text-center text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-3 py-3 min-w-[140px]"
                    >
                      {topic.label}
                    </th>
                  ))}
                  <th className="text-center text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-4 py-3 bg-emerald-50 border-l-2 border-emerald-200 min-w-[110px]">
                    Media
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr
                    key={row.studentId}
                    className="border-b border-(--border) last:border-0 hover:bg-(--tint-50)/60"
                  >
                    <td className="px-4 py-3 sticky left-0 bg-white z-10 hover:bg-(--tint-50)/60">
                      <div className="flex items-center gap-2.5">
                        <AvatarBox
                          gradient={row.gradient}
                          size="size-9"
                          radius="rounded-xl"
                          className="text-[11px]"
                        >
                          {row.initials}
                        </AvatarBox>
                        <div className="font-extrabold text-(--fg)">{row.name}</div>
                      </div>
                    </td>
                    {data.topics.map((topic) => (
                      <td key={topic.sectionId} className="px-3 py-3 text-center">
                        <GradeCell grade={row.averagesByTopic[topic.sectionId]} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center bg-emerald-50/40 border-l-2 border-emerald-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-lg font-extrabold text-(--fg)">
                          {formatGrade(row.overallAvg)}
                        </span>
                        <span className={`text-base font-extrabold ${TREND_CX[row.trend]}`}>
                          {TREND_ICON[row.trend]}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-(--tint-50) font-extrabold">
                  <td className="px-4 py-3 sticky left-0 bg-(--tint-50) text-xs uppercase tracking-wider text-(--fg-subtle)">
                    Media de clase
                  </td>
                  {data.topics.map((topic) => (
                    <td
                      key={topic.sectionId}
                      className="px-3 py-3 text-center text-sm text-(--fg-muted)"
                    >
                      {formatGrade(data.classAveragesByTopic[topic.sectionId])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center bg-emerald-100/70 border-l-2 border-emerald-200">
                    <span className="text-lg text-emerald-800">
                      {formatGrade(data.overallClassAverage)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-(--fg-muted) font-bold flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-md bg-emerald-100 border border-emerald-200" />
            Excelente (≥9)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-md bg-sky-100 border border-sky-200" />
            Bien (7–9)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-md bg-amber-100 border border-amber-200" />
            Suficiente (5–7)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-md bg-rose-100 border border-rose-200" />
            Necesita ayuda (&lt;5)
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <span className="size-3 rounded-md bg-(--tint-50) border border-(--border)" />
            Sin calificar
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-(--tint-100) p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            Media del curso
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-(--fg) leading-none">
              {formatGrade(data.overallClassAverage)}
            </span>
            <span className="text-base font-bold text-(--fg-muted)">/ 10</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-(--border) p-5">
          <h4 className="font-extrabold text-(--fg) text-sm mb-3">Distribución</h4>
          <DistributionChart bins={data.distribution} />
        </div>

        <div className="bg-white rounded-3xl border border-(--border) p-5">
          <h4 className="font-extrabold text-(--fg) text-sm mb-3">Reparto</h4>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-100 grid place-items-center text-lg">🏅</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-(--fg-muted)">Excelente (≥9)</div>
                <div className="font-extrabold text-(--fg)">{data.topCount} alumnos</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-sky-100 grid place-items-center text-lg">✅</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-(--fg-muted)">Aprobados</div>
                <div className="font-extrabold text-(--fg)">
                  {data.passCount} de {data.rows.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-100 grid place-items-center text-lg">🚨</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-(--fg-muted)">Necesitan ayuda</div>
                <div className="font-extrabold text-rose-800">
                  {data.riskCount} alumno{data.riskCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
