import type { Notification } from './Notification';

export default interface INotificationApi {
  getNotifications(token: string, userId: number, read: 0 | 1, limit?: number): Promise<Notification[]>;
  markAsRead(token: string, notificationId: number): Promise<void>;
  markAllAsRead(token: string, userId: number): Promise<void>;
}
