export type RecentItemId = string;

export interface RecentItem {
  id: RecentItemId;
  name: string;
  courseName: string;
  modName: string;
  timeAccess: number;
  viewUrl: string;
}
