import type IRecentlyAccessedRepository from '../domain/IRecentlyAccessedRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { RecentItem } from '../domain/RecentItem';

export default class RecentlyAccessedRepository implements IRecentlyAccessedRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getRecentItems(token: string): Promise<RecentItem[]> {
    return this.api.recentlyAccessed.getRecentItems(token);
  }
}
