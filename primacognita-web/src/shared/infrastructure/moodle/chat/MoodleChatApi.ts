import type IMoodleChatApi from './IMoodleChatApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { ChatConversation, ChatConversationMember } from '@/modules/chat/domain/ChatConversation';
import type { ChatMessage } from '@/modules/chat/domain/ChatMessage';
import type {
  GetConversationsResponse,
  GetConversationResponse,
  GetConversationBetweenUsersResponse,
  SendMessageResponse,
  SendInstantMessageResponse,
  UnreadCountResponse,
  ConversationMemberRaw,
} from '@/modules/chat/infrastructure/ChatResponse';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function mapConversation(raw: GetConversationResponse): ChatConversation {
  return {
    id: raw.id,
    name: raw.name,
    subname: raw.subname,
    imageurl: raw.imageurl,
    type: raw.type,
    membercount: raw.membercount,
    ismuted: raw.ismuted,
    isfavourite: raw.isfavourite,
    isread: raw.isread,
    unreadcount: raw.unreadcount,
    members: (raw.members ?? []).map((m) => ({
      id: m.id,
      fullname: m.fullname,
      profileimageurl: m.profileimageurl,
      isonline: m.isonline,
      showonlinestatus: m.showonlinestatus,
    })),
    lastMessage: raw.messages?.[0]
      ? {
          id: raw.messages[0].id,
          useridfrom: raw.messages[0].useridfrom,
          text: stripHtml(raw.messages[0].text),
          timecreated: raw.messages[0].timecreated,
        }
      : null,
    cansendmessagetoconversation: raw.cansendmessagetoconversation,
  };
}

export default class MoodleChatApi implements IMoodleChatApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getConversations(token: string, userId: number, limit = 50): Promise<ChatConversation[]> {
    const response = await this.moodleClient.call<GetConversationsResponse>(
      token,
      'core_message_get_conversations',
      { userid: String(userId), limitnum: String(limit) },
    );
    return (response.conversations ?? []).map((c) => mapConversation(c));
  }

  async getConversation(
    token: string,
    userId: number,
    conversationId: number,
    messageLimit = 100,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] }> {
    const response = await this.moodleClient.call<GetConversationResponse>(
      token,
      'core_message_get_conversation',
      {
        userid: String(userId),
        conversationid: String(conversationId),
        includecontactrequests: '0',
        includeprivacyinfo: '0',
        messagelimit: String(messageLimit),
      },
    );
    return {
      conversation: mapConversation(response),
      messages: (response.messages ?? []).map((m) => ({
        id: m.id,
        useridfrom: m.useridfrom,
        text: stripHtml(m.text),
        timecreated: m.timecreated,
      })),
    };
  }

  async getConversationBetweenUsers(
    token: string,
    userId: number,
    otherUserId: number,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null> {
    try {
      const response = await this.moodleClient.call<GetConversationBetweenUsersResponse>(
        token,
        'core_message_get_conversation_between_users',
        {
          userid: String(userId),
          otheruserid: String(otherUserId),
          includecontactrequests: '0',
          includeprivacyinfo: '0',
          messagelimit: '100',
        },
      );
      return {
        conversation: mapConversation(response),
        messages: (response.messages ?? []).map((m) => ({
          id: m.id,
          useridfrom: m.useridfrom,
          text: stripHtml(m.text),
          timecreated: m.timecreated,
        })),
      };
    } catch {
      return null;
    }
  }

  async searchUsers(token: string, userId: number, search: string): Promise<ChatConversationMember[]> {
    const response = await this.moodleClient.call<{
      contacts: ConversationMemberRaw[];
      noncontacts: ConversationMemberRaw[];
    }>(token, 'core_message_message_search_users', { userid: String(userId), search });
    return [...(response.contacts ?? []), ...(response.noncontacts ?? [])].map((m) => ({
      id: m.id,
      fullname: m.fullname,
      profileimageurl: m.profileimageurl,
      isonline: m.isonline,
      showonlinestatus: m.showonlinestatus,
    }));
  }

  async sendMessage(token: string, conversationId: number, text: string): Promise<ChatMessage> {
    const response = await this.moodleClient.call<SendMessageResponse>(
      token,
      'core_message_send_messages_to_conversation',
      {
        conversationid: String(conversationId),
        'messages[0][text]': text,
        'messages[0][textformat]': '1',
      },
    );
    return {
      id: response.id,
      useridfrom: response.useridfrom,
      text: stripHtml(response.text),
      timecreated: response.timecreated,
    };
  }

  async sendInstantMessage(
    token: string,
    toUserId: number,
    text: string,
  ): Promise<{ conversationId: number; message: ChatMessage }> {
    const response = await this.moodleClient.call<SendInstantMessageResponse>(
      token,
      'core_message_send_instant_messages',
      {
        'messages[0][touserid]': String(toUserId),
        'messages[0][text]': text,
        'messages[0][textformat]': '1',
      },
    );
    const result = response[0];
    if (result.errormessage) throw new Error(result.errormessage);
    return {
      conversationId: result.conversationid,
      message: {
        id: result.msgid,
        useridfrom: result.useridfrom,
        text: stripHtml(result.text),
        timecreated: result.timecreated,
      },
    };
  }

  async markConversationAsRead(token: string, userId: number, conversationId: number): Promise<void> {
    await this.moodleClient.call<unknown>(token, 'core_message_mark_all_conversation_messages_as_read', {
      userid: String(userId),
      conversationid: String(conversationId),
    });
  }

  async getUnreadCount(token: string, userId: number): Promise<number> {
    const response = await this.moodleClient.call<UnreadCountResponse>(
      token,
      'core_message_get_unread_conversation_counts',
      { userid: String(userId) },
    );
    const types = response.types ?? {};
    return (types['1'] ?? 0) + (types['2'] ?? 0);
  }
}
