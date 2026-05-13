import { useMemo } from 'react';
import { useSession } from '@/shared/hooks/useSession';
import { LoadingState } from '@/components/patterns/loadingState/LoadingState';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { COLOR_META } from '@/shared/theme/courseColors';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { useCalifications } from './hooks/useCalifications';
import { getGradeFeedback } from './utils/gradeFeedback';
import { TopicGradeCard } from './components/TopicGradeCard';
import { BadgesSection } from './components/BadgesSection';

export type CalificationsViewProps = {
  sections: CourseSection[];
  exercises: CourseModule[];
  courseId: string;
};

export const CalificationsView = ({ sections, exercises, courseId }: CalificationsViewProps) => {
  const { token, userId } = useSession();

  const { overallGrade, topicGrades, loading } = useCalifications({
    courseId,
    token,
    userId,
    exercises,
    sections,
  });

  const feedback = useMemo(() => getGradeFeedback(overallGrade), [overallGrade]);
  const c = COLOR_META[feedback.color];

  if (loading) {
    return <LoadingState emoji="🏆" label="Cargando calificaciones…" />;
  }

  if (topicGrades.length === 0) {
    return (
      <EmptyState
        emoji="📊"
        title="Sin calificaciones"
        subtitle="Aún no hay ejercicios calificados en este curso."
      />
    );
  }

  const circumference = 214;
  const offset = overallGrade != null ? ((10 - overallGrade) / 10) * circumference : circumference;

  return (
    <div className="grid grid-cols-[1fr] gap-5">
      {/* Hero card */}
      <div className={`relative overflow-hidden rounded-3xl border-2 ${c.border} bg-linear-to-br ${c.softBanner} via-white to-amber-50 p-6`}>
        <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {[
            ['10%', '25%', '#10b981'],
            ['28%', '55%', '#f59e0b'],
            ['48%', '15%', '#ec4899'],
            ['72%', '42%', '#8b5cf6'],
            ['88%', '25%', '#06b6d4'],
          ].map((coords, i) => (
            <circle key={i} cx={coords[0]} cy={coords[1]} r="4" fill={coords[2]} opacity="0.7" />
          ))}
        </svg>

        <div className="relative flex items-center gap-5">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e5e5" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={overallGrade != null ? (feedback.color === 'violet' ? '#8b5cf6' : feedback.color === 'emerald' ? '#10b981' : feedback.color === 'orange' ? '#f59e0b' : '#f43f5e') : '#d4d4d4'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${circumference - offset} ${circumference}`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-(--fg) leading-none">
                  {overallGrade != null ? overallGrade.toFixed(1).replace('.', ',') : '—'}
                </div>
                <div className="text-[10px] font-bold uppercase text-(--fg-subtle)">/ 10</div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-1`}>
              {feedback.emoji} Tu nota global
            </div>
            <h2 className="text-2xl font-extrabold text-(--fg) leading-tight mb-1">
              {feedback.title}
            </h2>
            <p className="text-sm text-(--fg-muted)">{feedback.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Per-topic grades */}
      <div className="bg-white rounded-3xl border border-(--border) p-6">
        <h3 className="font-extrabold text-(--fg) mb-4">Notas por tema</h3>
        <div className="flex flex-col gap-3">
          {topicGrades.map((topic, i) => (
            <TopicGradeCard key={topic.sectionId} topic={topic} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <BadgesSection />
    </div>
  );
};
