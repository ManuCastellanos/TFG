import type IForumRepository from '../domain/IForumRepository';
import type IForumApi from '../domain/IForumApi';
import type { ForumDiscussion, ForumMeta } from '../domain/ForumDiscussion';
import type { ForumPost } from '../domain/ForumPost';

export default class ForumRepository implements IForumRepository {
  constructor(private readonly api: IForumApi) {}

  getForumsByCourse(token: string, courseId: number): Promise<ForumMeta[]> {
    return this.api.getForumsByCourse(token, courseId);
  }

  getForumDiscussions(token: string, forumId: number): Promise<ForumDiscussion[]> {
    return this.api.getForumDiscussions(token, forumId);
  }

  getDiscussionPosts(token: string, discussionId: number): Promise<ForumPost[]> {
    return this.api.getDiscussionPosts(token, discussionId);
  }

  addDiscussion(token: string, forumId: number, subject: string, message: string): Promise<number> {
    return this.api.addDiscussion(token, forumId, subject, message);
  }

  addDiscussionPost(token: string, postId: number, subject: string, message: string): Promise<number> {
    return this.api.addDiscussionPost(token, postId, subject, message);
  }
}
