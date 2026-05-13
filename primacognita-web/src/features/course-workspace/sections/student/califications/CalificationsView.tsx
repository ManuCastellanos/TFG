import { useSession } from '@/shared/hooks/useSession';
import { LoadingState } from '@/components/patterns/loadingState/LoadingState';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { useCalifications } from './hooks/useCalifications';
import { TopicGradeCard } from './components/TopicGradeCard';
import { BadgesSection } from './components/BadgesSection';

export type CalificationsViewProps = {
  sections: CourseSection[];
  exercises: CourseModule[];
  courseId: string;
  onExerciseClick?: (cmid: number, modName: string) => void;
};

export const CalificationsView = ({ sections, exercises, courseId, onExerciseClick }: CalificationsViewProps) => {
  const { token, userId } = useSession();

  const { topicGrades, loading } = useCalifications({
    courseId,
    token,
    userId,
    exercises,
    sections,
  });

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

  return (
    <div className="grid grid-cols-[1fr] gap-5">
      {/* Per-topic grades */}
      <div className="bg-white rounded-3xl border border-(--border) p-6">
        <h3 className="font-extrabold text-(--fg) mb-4">Notas por tema</h3>
        <div className="flex flex-col gap-3">
          {topicGrades.map((topic, i) => (
            <TopicGradeCard key={topic.sectionId} topic={topic} defaultOpen={i === 0} onExerciseClick={onExerciseClick} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <BadgesSection />
    </div>
  );
};
