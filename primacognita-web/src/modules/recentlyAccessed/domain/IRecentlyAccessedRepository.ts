import type { RecentItem } from "./RecentItem";

export default interface IRecentlyAccessedRepository {
  getRecentItems(token: string): Promise<RecentItem[]>;
}
