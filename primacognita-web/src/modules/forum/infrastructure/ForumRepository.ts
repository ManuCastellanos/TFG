import type IForumRepository from '../domain/IForumRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { ForumDiscussion, ForumMeta } from '../domain/ForumDiscussion';
import type { ForumPost } from '../domain/ForumPost';

export default class ForumRepository implements IForumRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getForumsByCourse(token: string, courseId: number): Promise<ForumMeta[]> {
    return this.api.forum.getForumsByCourse(token, courseId);
  }

  getForumDiscussions(token: string, forumId: number): Promise<ForumDiscussion[]> {
    return this.api.forum.getForumDiscussions(token, forumId);
  }

  getDiscussionPosts(token: string, discussionId: number): Promise<ForumPost[]> {
    return this.api.forum.getDiscussionPosts(token, discussionId);
  }

  addDiscussion(token: string, forumId: number, subject: string, message: string): Promise<number> {
    return this.api.forum.addDiscussion(token, forumId, subject, message);
  }

  addDiscussionPost(token: string, postId: number, subject: string, message: string): Promise<number> {
    return this.api.forum.addDiscussionPost(token, postId, subject, message);
  }
}
