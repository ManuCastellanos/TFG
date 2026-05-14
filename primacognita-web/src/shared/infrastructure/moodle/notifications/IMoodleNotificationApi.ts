import type { Notification } from '@/modules/notifications/domain/Notification';

export default interface IMoodleNotificationApi {
  getNotifications(token: string, userId: number, read: 0 | 1, limit?: number): Promise<Notification[]>;
  markAsRead(token: string, notificationId: number): Promise<void>;
  markAllAsRead(token: string, userId: number): Promise<void>;
}
