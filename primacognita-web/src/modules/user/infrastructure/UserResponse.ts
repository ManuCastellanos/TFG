export type UserResponse = {
  userid: number;
  username: string;
  firstname: string;
  fullname: string;
  userpictureurl: string;
  functions: Array<{ name: string; version: string }>;
};

export type UserCoursesResponse = Array<{
  id: number;
}>;

export type MoodleRole = {
  roleid: number;
  name: string;
  shortname: string;
  sortorder: number;
};

export type EnrolledUsersResponse = Array<{
  id: number;
  fullname?: string;
  profileimageurl?: string;
  roles: MoodleRole[];
}>;

export type UserSearchResponse = {
  users: Array<{
    id: number;
    fullname?: string;
    firstname?: string;
    lastname?: string;
    profileimageurl?: string;
  }>;
};
