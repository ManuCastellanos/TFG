import type { ChatConversation, ChatConversationMember } from './ChatConversation';
import type { ChatMessage } from './ChatMessage';

export default interface IChatApi {
  getConversations(token: string, userId: number, limit?: number): Promise<ChatConversation[]>;
  getConversation(token: string, userId: number, conversationId: number, messageLimit?: number): Promise<{ conversation: ChatConversation; messages: ChatMessage[] }>;
  getConversationBetweenUsers(token: string, userId: number, otherUserId: number): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null>;
  searchUsers(token: string, userId: number, search: string): Promise<ChatConversationMember[]>;
  sendMessage(token: string, conversationId: number, text: string): Promise<ChatMessage>;
  sendInstantMessage(token: string, toUserId: number, text: string): Promise<{ conversationId: number; message: ChatMessage }>;
  markConversationAsRead(token: string, userId: number, conversationId: number): Promise<void>;
  getUnreadCount(token: string, userId: number): Promise<number>;
}
