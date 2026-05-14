import type INotificationRepository from '../domain/INotificationRepository';
import type INotificationApi from '../domain/INotificationApi';
import type { Notification } from '../domain/Notification';

export default class NotificationRepository implements INotificationRepository {
  constructor(private readonly api: INotificationApi) {}

  getNotifications(token: string, userId: number, read: 0 | 1, limit?: number): Promise<Notification[]> {
    return this.api.getNotifications(token, userId, read, limit);
  }

  markAsRead(token: string, notificationId: number): Promise<void> {
    return this.api.markAsRead(token, notificationId);
  }

  markAllAsRead(token: string, userId: number): Promise<void> {
    return this.api.markAllAsRead(token, userId);
  }
}
