export type DiscussionRaw = {
  id: number;
  name: string;
  groupid: number;
  timemodified: number;
  usermodified: number;
  timestart: number;
  timeend: number;
  discussion: number;
  parent: number;
  userid: number;
  created: number;
  modified: number;
  mailed: number;
  subject: string;
  message: string;
  messageformat: number;
  messagetrust: number;
  attachment: string;
  totalscore: number;
  mailnow: number;
  userfullname: string | null;
  usermodifiedfullname: string;
  userpictureurl: string | null;
  usermodifiedpictureurl: string;
  numreplies: number;
  numunread: number;
  pinned: boolean;
  locked: boolean;
  starred: boolean;
  canreply: boolean;
  canlock: boolean;
  canfavourite: boolean;
};

export type ForumDiscussionsResponse = {
  discussions: DiscussionRaw[];
  warnings: unknown[];
};

export type ForumRaw = {
  id: number;
  cmid: number;
  name: string;
  course: number;
  type: string;
};

export type ForumsByCourseResponse = ForumRaw[];

export type PostAuthor = {
  id: number | null;
  fullname: string;
  isdeleted: boolean;
  groups: Array<{ id: number; name: string; urls: { image: string | null } }>;
  urls: {
    profile: string | null;
    profileimage: string | null;
  };
};

export type PostRaw = {
  id: number;
  subject: string;
  replysubject: string;
  message: string;
  messageformat: number;
  author: PostAuthor;
  discussionid: number;
  hasparent: boolean;
  parentid: number | null;
  timecreated: number | null;
  timemodified: number | null;
  unread: boolean | null;
  isdeleted: boolean;
  isprivatereply: boolean;
  haswordcount: boolean;
  wordcount: number | null;
  charcount: number | null;
  capabilities: Record<string, boolean>;
  urls: Record<string, string | null>;
  attachments: unknown[];
  messageinlinefiles: unknown[];
  tags: unknown[];
  html: Record<string, string | null> | null;
};

export type DiscussionPostsResponse = {
  posts: PostRaw[];
  forumid: number;
  courseid: number;
  warnings: unknown[];
};

export type AddDiscussionResponse = {
  discussionid: number;
  warnings: unknown[];
};

export type AddDiscussionPostResponse = {
  postid: number;
  warnings: unknown[];
};
