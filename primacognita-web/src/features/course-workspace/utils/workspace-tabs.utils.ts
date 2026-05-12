import { WORKSPACE_TABS, type WorkspaceTab } from '../config/workspace-tabs.config';
import { isTeacherRole } from '@/modules/user/domain/User';

const normalizeRole = (role: string | null): string | null => (isTeacherRole(role) ? 'teacher' : role);

export const filterTabs = (role: string | null): WorkspaceTab[] =>
  WORKSPACE_TABS.filter((t) => t.variant === 'both' || t.variant === normalizeRole(role));
