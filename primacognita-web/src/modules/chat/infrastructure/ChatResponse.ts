export type ConversationMemberRaw = {
  id: number;
  fullname: string;
  profileimageurl: string;
  profileimageurlsmall: string;
  isonline: boolean;
  showonlinestatus: boolean;
  isblocked: boolean;
  iscontact: boolean;
  isdeleted: boolean;
  canmessageevenifblocked: boolean;
  canmessage: boolean;
  requirescontact: boolean;
  cancreatecontact: boolean;
};

export type MessageRaw = {
  id: number;
  useridfrom: number;
  text: string;
  timecreated: number;
};

export type ConversationRaw = {
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
  members: ConversationMemberRaw[];
  messages: MessageRaw[];
  candeletemessagesforallusers: boolean;
  cansendmessagetoconversation: boolean;
};

export type GetConversationsResponse = {
  conversations: ConversationRaw[];
};

export type GetConversationResponse = ConversationRaw;

export type GetConversationBetweenUsersResponse = ConversationRaw;

export type SendMessageResponse = MessageRaw;

export type SendInstantMessageResponse = Array<{
  msgid: number;
  text: string;
  timecreated: number;
  conversationid: number;
  useridfrom: number;
  errormessage?: string;
}>;

export type UnreadCountResponse = {
  favourites: number;
  types: Record<string, number>;
};
