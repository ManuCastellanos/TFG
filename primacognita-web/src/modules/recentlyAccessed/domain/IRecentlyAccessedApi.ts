import type { RecentItem } from './RecentItem';

export default interface IRecentlyAccessedApi {
  getRecentItems(token: string): Promise<RecentItem[]>;
}
