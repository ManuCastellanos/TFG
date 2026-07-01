import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { SubmissionEntry } from '@/modules/assignment/domain/SubmissionEntry';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import type { TeacherStatsData, PendingItem } from './types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type Inputs = {
  sections: CourseSection[];
  participants: Participant[];
  assignments: { id: number; cmId: number; title: string; maxGrade: number }[];
  submissionsByAssign: Record<number, SubmissionEntry[]>;
  gradesByAssign: Record<number, GradeEntry[]>;
  loading: boolean;
  error: string | null;
};

export function createTeacherStatsViewModel(inputs: Inputs, now: number): TeacherStatsData {
  const { sections, participants, assignments, submissionsByAssign, gradesByAssign, loading, error } = inputs;
  const students = participants.filter((p) => p.roleName && p.roleName.toLowerCase().includes('student'));

  const studentsCount = students.length;
  const weekAgo = now - WEEK_MS;
  const activeCount = students.filter((s) => (s.lastCourseAccess ?? 0) >= weekAgo).length;

  const pendingMap: Record<number, number> = {};
  const items: PendingItem[] = [];
  let total = 0;

  const participantMap = new Map(participants.map((p) => [parseInt(p.id, 10), p]));

  const cmidToAssign = Object.fromEntries((assignments ?? []).map((a) => [a.cmId, a]));

  const cmidToTopic: Record<number, { name: string; number: number }> = {};
  sections.forEach((section, idx) => {
    const topicNumber = section.id === 0 ? 0 : idx;
    for (const mod of section.modules) {
      cmidToTopic[mod.cmid] = { name: section.name, number: topicNumber };
    }
  });

  for (const assign of assignments ?? []) {
    const subs = submissionsByAssign[assign.id] ?? [];
    const grades = gradesByAssign[assign.id] ?? [];
    const gradeByUser = new Map(grades.map((g) => [g.userId, g]));

    const pending = subs.filter((s) => {
      if (s.status !== 'submitted') return false;
      const grade = gradeByUser.get(s.userId);
      if (!grade) return true;
      // Resubmission: submitted again after last grade
      return (s.submittedAt ?? 0) > (grade.gradedAt ?? 0);
    });
    pendingMap[assign.cmId] = pending.length;
    total += pending.length;

    const topic = cmidToTopic[assign.cmId];

    for (const sub of pending) {
      const participant = participantMap.get(sub.userId);
      const isResubmit = gradeByUser.has(sub.userId);
      const fileCount = sub.files?.length ?? 0;
      const detail =
        fileCount > 0
          ? `${fileCount} ${fileCount === 1 ? 'archivo' : 'archivos'}${isResubmit ? ' · reenvío' : ''}`
          : isResubmit
            ? 'reenvío'
            : 'entrega';

      items.push({
        activityName: assign.title,
        activityKind: 'assign',
        assignId: assign.id,
        cmId: assign.cmId,
        userId: sub.userId,
        userName: participant?.fullName ?? `Usuario ${sub.userId}`,
        submittedAt: sub.submittedAt ?? 0,
        topic: topic ? (topic.number > 0 ? `Tema ${topic.number}` : topic.name) : undefined,
        detail,
        subKind: isResubmit ? 'resubmit' : undefined,
      });
    }
  }

  items.sort((a, b) => b.submittedAt - a.submittedAt);

  const progressMap: Record<number, number> = {};
  const studentsNum = students.length;
  for (const section of sections) {
    const assignModules = section.modules.filter((m) => m.modName === 'assign');
    if (assignModules.length === 0 || studentsNum === 0) {
      progressMap[section.id] = 0;
      continue;
    }
    const expected = assignModules.length * studentsNum;
    let received = 0;
    for (const mod of assignModules) {
      const assign = cmidToAssign[mod.cmid];
      if (!assign) continue;
      const subs = submissionsByAssign[assign.id] ?? [];
      const grades = gradesByAssign[assign.id] ?? [];
      const gradedIds = new Set(grades.map((g) => g.userId));
      received += subs.filter((s) => s.status === 'submitted' || gradedIds.has(s.userId)).length;
    }
    progressMap[section.id] = Math.round((received / expected) * 100);
  }

  const studentProgressMap: Record<string, number> = {};
  const totalAssigns = (assignments ?? []).length;
  for (const student of students) {
    const uid = parseInt(student.id, 10);
    let done = 0;
    for (const assign of assignments ?? []) {
      const grades = gradesByAssign[assign.id] ?? [];
      const subs = submissionsByAssign[assign.id] ?? [];
      if (grades.some((g) => g.userId === uid)) {
        done++;
      } else if (subs.some((s) => s.userId === uid && s.status === 'submitted')) {
        done++;
      }
    }
    studentProgressMap[student.id] = totalAssigns > 0 ? Math.round((done / totalAssigns) * 100) : 0;
  }

  return {
    studentsCount,
    activeCount,
    pendingTotal: total,
    pendingByModule: pendingMap,
    sectionProgress: progressMap,
    progressByStudent: studentProgressMap,
    pendingItems: items,
    assignments: assignments ?? [],
    gradesByAssign: gradesByAssign ?? {},
    loading,
    error,
  };
}
