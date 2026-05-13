export type ForumDiscussion = {
  id: number;
  discussion: number;
  name: string;
  subject: string;
  message: string;
  userid: number;
  userfullname: string | null;
  numreplies: number;
  timemodified: number;
  created: number;
  pinned: boolean;
  locked: boolean;
  canreply: boolean;
};

export type ForumMeta = {
  id: number;
  cmid: number;
  name: string;
  course: number;
  type: string;
};
