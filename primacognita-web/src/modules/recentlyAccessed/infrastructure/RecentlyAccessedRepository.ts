import type IRecentlyAccessedRepository from '../domain/IRecentlyAccessedRepository';
import type IRecentlyAccessedApi from '../domain/IRecentlyAccessedApi';
import type { RecentItem } from '../domain/RecentItem';

export default class RecentlyAccessedRepository implements IRecentlyAccessedRepository {
  constructor(private readonly api: IRecentlyAccessedApi) {}

  getRecentItems(token: string): Promise<RecentItem[]> {
    return this.api.getRecentItems(token);
  }
}
