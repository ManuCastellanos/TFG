import { useParams } from '@tanstack/react-router';
import { Alert } from '@/components/ui/alert/Alert';
import { useSession } from '@/shared/hooks/useSession';
import { useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { getCapabilities } from '../utils/workspace-capabilities';
import { useCoursePageData } from '../hooks/useCoursePage';
import { useParticipants } from '../sections/student/participants/hooks/useParticipants';
import { useTeacherStats } from '../hooks/useTeacherStats';
import { useUpcomingAssignments } from '../hooks/useUpcomingAssignments';
import { useCourseWorkspaceHandlers } from '../hooks/useCourseWorkspaceHandlers';
import { useCourseWorkspaceHeader } from '../hooks/useCourseWorkspaceHeader';
import { createCourseWorkspaceViewModel } from '../view-models/createCourseWorkspaceViewModel';
import { createTeacherStatsViewModel } from '../view-models/createTeacherStatsViewModel';
import { CourseWorkspaceView } from './CourseWorkspaceView';

export default function CourseWorkspacePage() {
  const { id: courseId } = useParams({ strict: false }) as { id: string };
  const { token, userId, roleName } = useSession();
  const { courseRepository } = useDependencies();
  const { emoji: courseEmoji, color: courseColor } = useCourseCustomization(courseId);

  const courseData = useCoursePageData(courseId, userId, token);
  const { participants, loading: participantsLoading } = useParticipants(token, courseId);
  const caps = getCapabilities(roleName);
  const teacherData = useTeacherStats(caps.canReviewExercises ? token : null, courseId);
  const { upcoming: upcomingAssignments, loading: upcomingAssignmentsLoading } = useUpcomingAssignments(courseId);

  const teacherStats = createTeacherStatsViewModel({
    sections: courseData.sections,
    participants,
    assignments: teacherData.assignments,
    submissionsByAssign: teacherData.submissionsByAssign,
    gradesByAssign: teacherData.gradesByAssign,
    loading: teacherData.loading,
    error: teacherData.error,
  });

  const viewModel = createCourseWorkspaceViewModel({
    roleName,
    course: courseData.course,
    sections: courseData.sections,
    teacherStats,
  });

  useCourseWorkspaceHeader(courseData.course?.fullname, courseEmoji, courseColor);

  const { handleModuleClick, handleUpcomingAssignmentClick, handleToggleComplete } = useCourseWorkspaceHandlers(
    courseId,
    token,
    courseData.updateModuleCompletion,
    (t, cmid, completed) => courseRepository.markActivityComplete(t, cmid, completed),
  );

  if (courseData.error) return <Alert variant="error">{courseData.error}</Alert>;

  return (
    <CourseWorkspaceView
      viewModel={viewModel}
      course={courseData.course}
      exercises={courseData.exercises}
      loading={courseData.loading}
      participants={participants}
      participantsLoading={participantsLoading}
      teacherStats={teacherStats}
      upcomingAssignments={upcomingAssignments}
      upcomingAssignmentsLoading={upcomingAssignmentsLoading}
      courseColor={courseColor}
      courseId={courseId}
      onModuleClick={handleModuleClick}
      onToggleComplete={caps.canReviewExercises ? undefined : handleToggleComplete}
      onUpcomingAssignmentClick={handleUpcomingAssignmentClick}
    />
  );
}
