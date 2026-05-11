export type ParticipantResponse = {
  id: number;
  fullname?: string;
  profileimageurl?: string;
  lastcourseaccess?: number;
  roles?: Array<{
    roleid: number;
    name: string;
    shortname: string;
    sortorder: number;
  }>;
};
