import type { WorkspaceCapabilities } from '../utils/workspace-capabilities';
import type { WorkspaceTab } from '../config/workspace-tabs.config';
import type { EnrichedSection } from '../utils/sections/enrichSections';

export type CourseWorkspaceViewModel = {
  caps: WorkspaceCapabilities;
  tabs: WorkspaceTab[];
  enrichedSections: EnrichedSection[];
  bannerProgress: number;
  bannerTotal: number;
  bannerDone: number;
  avgProgress: number;
};

export type PendingItem = {
  activityName: string;
  activityKind: 'assign';
  assignId: number;
  cmId: number;
  userId: number;
  userName: string;
  submittedAt: number;
};

export type TeacherStatsData = {
  studentsCount: number;
  activeCount: number;
  pendingTotal: number;
  pendingByModule: Record<number, number>;
  sectionProgress: Record<number, number>;
  progressByStudent: Record<string, number>;
  pendingItems: PendingItem[];
  loading: boolean;
  error: string | null;
};
