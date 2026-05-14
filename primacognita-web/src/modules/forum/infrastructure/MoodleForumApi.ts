import type IForumApi from '../domain/IForumApi';
import type { ForumDiscussion, ForumMeta } from '../domain/ForumDiscussion';
import type { ForumPost } from '../domain/ForumPost';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type {
  ForumDiscussionsResponse,
  ForumsByCourseResponse,
  DiscussionPostsResponse,
  AddDiscussionResponse,
  AddDiscussionPostResponse,
} from './ForumResponse';

export default class MoodleForumApi implements IForumApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getForumsByCourse(token: string, courseId: number): Promise<ForumMeta[]> {
    const forums = await this.moodleClient.call<ForumsByCourseResponse>(
      token,
      'mod_forum_get_forums_by_courses',
      { 'courseids[0]': String(courseId) },
    );

    return (forums ?? []).map((f) => ({
      id: f.id,
      cmid: f.cmid,
      name: f.name,
      course: f.course,
      type: f.type,
    }));
  }

  async getForumDiscussions(token: string, forumId: number): Promise<ForumDiscussion[]> {
    const response = await this.moodleClient.call<ForumDiscussionsResponse>(
      token,
      'mod_forum_get_forum_discussions',
      { forumid: String(forumId), sortorder: '-1' },
    );

    return (response.discussions ?? []).map((d) => ({
      id: d.id,
      discussion: d.discussion,
      name: d.name,
      subject: d.subject,
      message: d.message,
      userid: d.userid,
      userfullname: d.userfullname,
      numreplies: d.numreplies,
      timemodified: d.timemodified,
      created: d.created,
      pinned: d.pinned,
      locked: d.locked,
      canreply: d.canreply,
    }));
  }

  async getDiscussionPosts(token: string, discussionId: number): Promise<ForumPost[]> {
    const response = await this.moodleClient.call<DiscussionPostsResponse>(
      token,
      'mod_forum_get_discussion_posts',
      { discussionid: String(discussionId) },
    );

    return (response.posts ?? []).map((p) => ({
      id: p.id,
      subject: p.subject,
      message: p.message,
      author: {
        id: p.author.id,
        fullname: p.author.fullname,
        urls: {
          profile: p.author.urls.profile,
          profileimage: p.author.urls.profileimage,
        },
      },
      discussionid: p.discussionid,
      parentid: p.parentid,
      hasparent: p.hasparent,
      timecreated: p.timecreated,
      timemodified: p.timemodified,
      isdeleted: p.isdeleted,
    }));
  }

  async addDiscussion(token: string, forumId: number, subject: string, message: string): Promise<number> {
    const response = await this.moodleClient.call<AddDiscussionResponse>(
      token,
      'mod_forum_add_discussion',
      {
        forumid: String(forumId),
        subject,
        message,
      },
    );

    return response.discussionid;
  }

  async addDiscussionPost(token: string, postId: number, subject: string, message: string): Promise<number> {
    const response = await this.moodleClient.call<AddDiscussionPostResponse>(
      token,
      'mod_forum_add_discussion_post',
      {
        postid: String(postId),
        subject,
        message,
      },
    );

    return response.postid;
  }
}
