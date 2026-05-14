import type INotificationRepository from '../domain/INotificationRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { Notification } from '../domain/Notification';

export default class NotificationRepository implements INotificationRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getNotifications(token: string, userId: number, read: 0 | 1, limit?: number): Promise<Notification[]> {
    return this.api.notifications.getNotifications(token, userId, read, limit);
  }

  markAsRead(token: string, notificationId: number): Promise<void> {
    return this.api.notifications.markAsRead(token, notificationId);
  }

  markAllAsRead(token: string, userId: number): Promise<void> {
    return this.api.notifications.markAllAsRead(token, userId);
  }
}
