export type ChatConversationMember = {
  id: number;
  fullname: string;
  profileimageurl: string;
  isonline: boolean;
  showonlinestatus: boolean;
};

export type ChatConversation = {
  id: number;
  name: string | null;
  subname: string | null;
  imageurl: string | null;
  type: number;
  membercount: number;
  ismuted: boolean;
  isfavourite: boolean;
  isread: boolean;
  unreadcount: number;
  members: ChatConversationMember[];
  lastMessage: {
    id: number;
    useridfrom: number;
    text: string;
    timecreated: number;
  } | null;
  cansendmessagetoconversation: boolean;
};
