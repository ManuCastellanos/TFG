import type IChatRepository from '../domain/IChatRepository';
import type IChatApi from '../domain/IChatApi';
import type { ChatConversation, ChatConversationMember } from '../domain/ChatConversation';
import type { ChatMessage } from '../domain/ChatMessage';

export default class ChatRepository implements IChatRepository {
  constructor(private readonly api: IChatApi) {}

  getConversations(token: string, userId: number, limit?: number): Promise<ChatConversation[]> {
    return this.api.getConversations(token, userId, limit);
  }

  getConversation(
    token: string,
    userId: number,
    conversationId: number,
    messageLimit?: number,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] }> {
    return this.api.getConversation(token, userId, conversationId, messageLimit);
  }

  getConversationBetweenUsers(
    token: string,
    userId: number,
    otherUserId: number,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null> {
    return this.api.getConversationBetweenUsers(token, userId, otherUserId);
  }

  searchUsers(token: string, userId: number, search: string): Promise<ChatConversationMember[]> {
    return this.api.searchUsers(token, userId, search);
  }

  sendMessage(token: string, conversationId: number, text: string): Promise<ChatMessage> {
    return this.api.sendMessage(token, conversationId, text);
  }

  sendInstantMessage(
    token: string,
    toUserId: number,
    text: string,
  ): Promise<{ conversationId: number; message: ChatMessage }> {
    return this.api.sendInstantMessage(token, toUserId, text);
  }

  markConversationAsRead(token: string, userId: number, conversationId: number): Promise<void> {
    return this.api.markConversationAsRead(token, userId, conversationId);
  }

  getUnreadCount(token: string, userId: number): Promise<number> {
    return this.api.getUnreadCount(token, userId);
  }
}
