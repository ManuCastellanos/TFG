import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CourseModule, CourseSection } from "@/modules/course/domain/CourseSection";
import type { EnrichedExercise, ExerciseState } from "../types/exercise.types";
import { useDependencies } from "@/shared/providers/DependenciesProvider";
import { INTERNAL_MODULE_NAMES } from "@/features/course-workspace/utils/workspace-mappers";

type UseEnrichedExercisesParams = {
  courseId: string | null;
  token: string | null;
  userId: string | null;
  exercises: CourseModule[];
  sections: CourseSection[];
};

type Result = {
  enriched: EnrichedExercise[];
  loading: boolean;
};

export function useEnrichedExercises({
  courseId,
  token,
  userId,
  exercises,
  sections,
}: UseEnrichedExercisesParams): Result {
  const { assignmentRepository, quizRepository } = useDependencies();
  const sectionByCmid = useMemo(() => buildSectionMap(sections), [sections]);

  const queryKey = [
    "enrichedExercises",
    courseId,
    userId,
    exercises.map((m) => m.cmid).sort().join(","),
  ] as const;

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const courseIdNum = Number(courseId);
      const userIdNum = Number(userId);
      const now = Date.now();

      const dueByCmid: Record<number, number> = {};
      const maxByCmid: Record<number, number> = {};
      const scoreByCmid: Record<number, number> = {};

      const assignModules = exercises.filter((m) => m.modName === "assign");
      const quizModules = exercises.filter((m) => m.modName === "quiz");

      const promises: Promise<void>[] = [];

      if (assignModules.length > 0) {
        promises.push(
          (async () => {
            for (const am of assignModules) {
              try {
                const assignData = await assignmentRepository.getAssignment(token!, courseIdNum, am.cmid, userIdNum);
                if (!assignData) continue;
                if (assignData.dueDate != null) dueByCmid[am.cmid] = Math.floor(assignData.dueDate / 1000);
                maxByCmid[am.cmid] = assignData.maxGrade;
                if (assignData.isGraded && assignData.grade) {
                  scoreByCmid[am.cmid] = Number(assignData.grade.grade);
                }
              } catch {
                // silencio
              }
            }
          })(),
        );
      }

      if (quizModules.length > 0) {
        const quizzes = await quizRepository.getQuizzesByCourse(token!, courseIdNum).catch(() => []);

        const quizMetaByCmid: Record<number, { id: number; dueDate?: number; gradeMax: number }> = {};
        for (const q of quizzes) {
          quizMetaByCmid[q.cmid] = {
            id: q.id,
            dueDate: q.dueDate ? Math.floor(q.dueDate.getTime() / 1000) : undefined,
            gradeMax: q.gradeMax,
          };
        }

        for (const cmid of quizModules.map((m) => m.cmid)) {
          const meta = quizMetaByCmid[cmid];
          if (!meta) continue;
          if (meta.dueDate != null) dueByCmid[cmid] = meta.dueDate;
          maxByCmid[cmid] = meta.gradeMax;
        }

        promises.push(
          (async () => {
            await Promise.all(
              quizModules.map(async (qm) => {
                const meta = quizMetaByCmid[qm.cmid];
                if (!meta) return;

                try {
                  const attempts = await quizRepository.getUserAttempts(token!, meta.id, userIdNum);
                  const finished = attempts.filter((a) => a.state === "finished");
                  if (finished.length === 0) return;

                  const latest = finished.reduce((best, a) =>
                    (a.sumGrades ?? 0) > (best.sumGrades ?? 0) ? a : best,
                  );

                  const review = await quizRepository.getAttemptReview(token!, latest.id).catch(() => null);
                  if (review) {
                    scoreByCmid[qm.cmid] = Number(review.grade);
                  }
                } catch {
                  // silencio
                }
              }),
            );
          })(),
        );
      }

      await Promise.all(promises);

      return exercises.map((m) => {
        const dueTs = dueByCmid[m.cmid] ?? null;
        const hasGrade = scoreByCmid[m.cmid] !== undefined;

        let state: ExerciseState;
        const completionState = m.completion?.state ?? 0;

        if (hasGrade) {
          state = "graded";
        } else if (completionState >= 1) {
          state = "submitted";
        } else if (dueTs != null && dueTs * 1000 < now) {
          state = "late";
        } else {
          state = "pending";
        }

        return {
          id: m.id,
          cmid: m.cmid,
          title: m.name,
          kind: m.modName as EnrichedExercise["kind"],
          topic: sectionByCmid[m.cmid] ?? "",
          dueTimestamp: dueTs,
          state,
          score: hasGrade ? scoreByCmid[m.cmid] : null,
          max: maxByCmid[m.cmid] ?? null,
          isInternal: INTERNAL_MODULE_NAMES.includes(m.modName),
        };
      });
    },
    enabled: !!token && !!courseId && !!userId && exercises.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return {
    enriched: data ?? buildFallback(exercises, sections, sectionByCmid),
    loading: isLoading,
  };
}

function buildFallback(
  exercises: CourseModule[],
  _sections: CourseSection[],
  sectionByCmid: Record<number, string>,
): EnrichedExercise[] {
  return exercises.map((m) => {
    const completionState = m.completion?.state ?? 0;
    let state: ExerciseState;
    if (completionState >= 1) state = "submitted";
    else state = "pending";

    return {
      id: m.id,
      cmid: m.cmid,
      title: m.name,
      kind: m.modName as EnrichedExercise["kind"],
      topic: sectionByCmid[m.cmid] ?? "",
      dueTimestamp: null,
      state,
      score: null,
      max: null,
      isInternal: INTERNAL_MODULE_NAMES.includes(m.modName),
    };
  });
}

function buildSectionMap(sections: CourseSection[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const section of sections) {
    for (const mod of section.modules) {
      map[mod.cmid] = section.name;
    }
  }
  return map;
}
