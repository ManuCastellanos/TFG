import { useEffect, useState } from "react";
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
  const [enriched, setEnriched] = useState<EnrichedExercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !courseId || !userId || exercises.length === 0) {
      setEnriched(buildFallback(exercises, sections));
      return;
    }

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const courseIdNum = Number(courseId);
        const userIdNum = Number(userId);
        const now = Date.now();
        const sectionByCmid = buildSectionMap(sections);

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
                  const assignData = await assignmentRepository.getAssignment(token, courseIdNum, am.cmid, userIdNum);
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
          promises.push(
            (async () => {
              for (const qm of quizModules) {
                try {
                  const meta = await quizRepository.getQuizByCmid(token, courseIdNum, qm.cmid);
                  if (!meta) continue;
                  if (meta.dueDate) dueByCmid[qm.cmid] = Math.floor(meta.dueDate.getTime() / 1000);
                  maxByCmid[qm.cmid] = meta.gradeMax;

                  const attempts = await quizRepository.getUserAttempts(token, meta.id, userIdNum);
                  const finished = attempts.filter((a) => a.state === "finished");
                  if (finished.length > 0) {
                    const best = finished.reduce((a, b) => Math.max(a, b.sumGrades ?? 0), 0);
                    scoreByCmid[qm.cmid] = best;
                  }
                } catch {
                  // silencio
                }
              }
            })(),
          );
        }

        await Promise.all(promises);
        if (cancelled) return;

        const result: EnrichedExercise[] = exercises.map((m) => {
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

        if (!cancelled) setEnriched(result);
      } catch {
        if (!cancelled) setEnriched(buildFallback(exercises, sections));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetch();
    return () => {
      cancelled = true;
    };
  }, [assignmentRepository, quizRepository, token, courseId, userId, exercises, sections]);

  return { enriched, loading };
}

function buildFallback(exercises: CourseModule[], sections: CourseSection[]): EnrichedExercise[] {
  const sectionByCmid = buildSectionMap(sections);
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
