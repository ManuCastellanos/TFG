import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';

export default interface IMoodleRecentlyAccessedApi {
  getRecentItems(token: string): Promise<RecentItem[]>;
}
