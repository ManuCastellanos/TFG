import { isTeacherRole } from '@/modules/user/domain/User';

export type WorkspaceCapabilities = {
  canReviewExercises: boolean;
  canGrade: boolean;
  canAddActivities: boolean;
  canViewRoster: boolean;
  canViewSidebar: boolean;
  canViewProgressBanner: boolean;
  canViewTeacherCard: boolean;
};

export const getCapabilities = (roleName: string | null): WorkspaceCapabilities => {
  const isTeacher = isTeacherRole(roleName);
  return {
    canReviewExercises: isTeacher,
    canGrade: isTeacher,
    canAddActivities: isTeacher,
    canViewRoster: isTeacher,
    canViewSidebar: !isTeacher,
    canViewProgressBanner: !isTeacher,
    canViewTeacherCard: !isTeacher,
  };
};
