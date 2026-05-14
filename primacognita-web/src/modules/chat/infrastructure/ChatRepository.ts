import type IChatRepository from '../domain/IChatRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { ChatConversation, ChatConversationMember } from '../domain/ChatConversation';
import type { ChatMessage } from '../domain/ChatMessage';

export default class ChatRepository implements IChatRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getConversations(token: string, userId: number, limit?: number): Promise<ChatConversation[]> {
    return this.api.chat.getConversations(token, userId, limit);
  }

  getConversation(
    token: string,
    userId: number,
    conversationId: number,
    messageLimit?: number,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] }> {
    return this.api.chat.getConversation(token, userId, conversationId, messageLimit);
  }

  getConversationBetweenUsers(
    token: string,
    userId: number,
    otherUserId: number,
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null> {
    return this.api.chat.getConversationBetweenUsers(token, userId, otherUserId);
  }

  searchUsers(token: string, userId: number, search: string): Promise<ChatConversationMember[]> {
    return this.api.chat.searchUsers(token, userId, search);
  }

  sendMessage(token: string, conversationId: number, text: string): Promise<ChatMessage> {
    return this.api.chat.sendMessage(token, conversationId, text);
  }

  sendInstantMessage(
    token: string,
    toUserId: number,
    text: string,
  ): Promise<{ conversationId: number; message: ChatMessage }> {
    return this.api.chat.sendInstantMessage(token, toUserId, text);
  }

  markConversationAsRead(token: string, userId: number, conversationId: number): Promise<void> {
    return this.api.chat.markConversationAsRead(token, userId, conversationId);
  }

  getUnreadCount(token: string, userId: number): Promise<number> {
    return this.api.chat.getUnreadCount(token, userId);
  }
}
