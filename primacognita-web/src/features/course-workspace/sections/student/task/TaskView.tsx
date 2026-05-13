import { useMemo, useState } from "react";
import { useSession } from "@/shared/hooks/useSession";
import { EmptyState } from "@/components/patterns/emptyState/EmptyState";
import { LoadingState } from "@/components/patterns/loadingState/LoadingState";
import type { CourseModule, CourseSection } from "@/modules/course/domain/CourseSection";
import type { ExerciseState } from "./types/exercise.types";
import { useEnrichedExercises } from "./hooks/useEnrichedExercises";
import { ExerciseRow } from "./components/ExerciseRow";
import { SummaryCard } from "./components/SummaryCard";
import { NextDueCard } from "./components/NextDueCard";
import { Button } from "@/components/ui/button/Button";

type FilterKey = "todos" | ExerciseState;

export type TaskViewProps = {
  exercises: CourseModule[];
  sections: CourseSection[];
  courseId: string;
  onExerciseClick?: (module: CourseModule) => void;
};

export const TaskView = ({ exercises, sections, courseId, onExerciseClick }: TaskViewProps) => {
  const { token, userId } = useSession();
  const { enriched, loading } = useEnrichedExercises({
    courseId,
    token,
    userId,
    exercises,
    sections,
  });

  const [now] = useState(() => Date.now());
  const [filter, setFilter] = useState<FilterKey>("todos");

  const counts = useMemo(() => {
    const all = enriched.length;
    const pending = enriched.filter((e) => e.state === "pending").length;
    const submitted = enriched.filter((e) => e.state === "submitted").length;
    const graded = enriched.filter((e) => e.state === "graded").length;
    return { todos: all, pending, submitted, graded };
  }, [enriched]);

  const filtered = useMemo(
    () => (filter === "todos" ? enriched : enriched.filter((e) => e.state === filter)),
    [enriched, filter],
  );

  const nextDue = useMemo(() => {
    const future = enriched
      .filter((e) => e.dueTimestamp != null && e.dueTimestamp * 1000 > now)
      .sort((a, b) => (a.dueTimestamp ?? 0) - (b.dueTimestamp ?? 0));
    return future[0] ?? null;
  }, [enriched, now]);

  const filters: { id: "todos" | "pending" | "submitted" | "graded"; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "pending", label: "Por hacer" },
    { id: "submitted", label: "Entregados" },
    { id: "graded", label: "Calificados" },
  ];

  if (loading) {
    return <LoadingState emoji="📝" label="Cargando ejercicios…" />;
  }

  if (enriched.length === 0) {
    return (
      <EmptyState
        emoji="📋"
        title="No hay ejercicios"
        subtitle="Este curso aún no tiene ejercicios disponibles."
      />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-(--fg)">Tus ejercicios</h2>
            <p className="text-sm text-(--fg-muted)">Todo lo que tienes que hacer en este curso.</p>
          </div>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <Button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full font-bold text-xs transition border-2 ${
                  filter === f.id
                    ? "bg-[#274E38] text-white border-[#274E38]"
                    : "bg-white text-(--fg-muted) border-(--border) hover:border-(--border-strong)"
                }`}
              >
                {f.label}
                <span
                  className={`text-xs font-black px-1.5 rounded-full ${
                    filter === f.id ? "bg-white/20" : "bg-(--tint-100)"
                  }`}
                >
                  {counts[f.id]}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {filtered.map((e) => (
            <ExerciseRow
              key={e.id}
              exercise={e}
              now={now}
              onClick={() => {
                const mod = exercises.find((m) => m.id === e.id);
                if (mod && onExerciseClick) onExerciseClick(mod);
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SummaryCard
          graded={counts.graded}
          total={counts.todos}
          pending={counts.pending}
          submitted={counts.submitted}
        />

        {nextDue && (
          <NextDueCard
            title={nextDue.title}
            daysLabel={formatDaysLabel(nextDue.dueTimestamp!, now)}
          />
        )}
      </div>
    </div>
  );
};

function formatDaysLabel(dueTs: number, now: number): string {
  const diffDays = Math.round((dueTs * 1000 - now) / 86400000);
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "en 1 día";
  return `en ${diffDays} días`;
}
