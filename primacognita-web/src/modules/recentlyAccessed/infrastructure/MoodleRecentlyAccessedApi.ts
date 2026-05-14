import type IRecentlyAccessedApi from '../domain/IRecentlyAccessedApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { RecentItem } from '../domain/RecentItem';
import type { RecentItemResponse } from './RecentItemResponse';

export default class MoodleRecentlyAccessedApi implements IRecentlyAccessedApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getRecentItems(token: string): Promise<RecentItem[]> {
    const response = await this.moodleClient.call<RecentItemResponse[]>(
      token,
      'block_recentlyaccesseditems_get_recent_items',
      {},
    );

    return response.map((item) => ({
      id: String(item.id),
      name: item.name,
      courseName: item.coursename ?? '',
      modName: item.modname ?? 'unknown',
      timeAccess: item.timeaccess ?? 0,
      viewUrl: item.viewurl ?? '',
      courseId: item.courseid,
      cmId: item.cmid,
    }));
  }
}
