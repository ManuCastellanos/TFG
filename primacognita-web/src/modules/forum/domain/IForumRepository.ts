import type { ForumDiscussion, ForumMeta } from './ForumDiscussion';
import type { ForumPost } from './ForumPost';

export default interface IForumRepository {
  getForumsByCourse(token: string, courseId: number): Promise<ForumMeta[]>;
  getForumDiscussions(token: string, forumId: number): Promise<ForumDiscussion[]>;
  getDiscussionPosts(token: string, discussionId: number): Promise<ForumPost[]>;
  addDiscussion(token: string, forumId: number, subject: string, message: string): Promise<number>;
  addDiscussionPost(token: string, postId: number, subject: string, message: string): Promise<number>;
}
