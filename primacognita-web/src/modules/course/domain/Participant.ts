export interface Participant {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  avatarUrlSmall: string | null;
  roleId: number | null;
  roleName: string | null;
  roleDisplayName: string | null;
  lastCourseAccess?: number;
}
