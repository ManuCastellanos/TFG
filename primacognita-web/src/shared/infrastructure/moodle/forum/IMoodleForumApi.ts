import type { ForumDiscussion, ForumMeta } from '@/modules/forum/domain/ForumDiscussion';
import type { ForumPost } from '@/modules/forum/domain/ForumPost';

export default interface IMoodleForumApi {
  getForumsByCourse(token: string, courseId: number): Promise<ForumMeta[]>;
  getForumDiscussions(token: string, forumId: number): Promise<ForumDiscussion[]>;
  getDiscussionPosts(token: string, discussionId: number): Promise<ForumPost[]>;
  addDiscussion(token: string, forumId: number, subject: string, message: string): Promise<number>;
  addDiscussionPost(token: string, postId: number, subject: string, message: string): Promise<number>;
}
