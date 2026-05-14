export type NotificationRaw = {
  id: number;
  useridfrom: number;
  useridto: number;
  subject: string;
  text: string;
  fullmessage: string;
  fullmessageformat: number;
  fullmessagehtml: string;
  smallmessage: string;
  notification: number;
  contexturl: string | null;
  contexturlname: string | null;
  timecreated: number;
  timeread: number | null;
  userfromfullname: string;
  userfromprofileimageurl: string;
  component?: string;
  eventtype?: string;
};

export type GetNotificationsResponse = {
  messages: NotificationRaw[];
};
