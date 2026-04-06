export type UserResponse = {
  userid: number;
  username: string;
  firstname: string;
  fullname: string;
  userpictureurl: string;
  functions: Array<{ name: string; version: string }>;
};