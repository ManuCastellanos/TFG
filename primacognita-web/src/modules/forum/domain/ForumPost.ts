export type ForumPost = {
  id: number;
  subject: string;
  message: string;
  author: {
    id: number | null;
    fullname: string;
    urls: {
      profile: string | null;
      profileimage: string | null;
    };
  };
  discussionid: number;
  parentid: number | null;
  hasparent: boolean;
  timecreated: number | null;
  timemodified: number | null;
  isdeleted: boolean;
};
