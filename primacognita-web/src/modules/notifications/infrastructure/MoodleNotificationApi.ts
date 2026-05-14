import type INotificationApi from '../domain/INotificationApi';
import type { Notification, NotificationType } from '../domain/Notification';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { NotificationRaw, GetNotificationsResponse } from './NotificationResponse';

function inferType(raw: NotificationRaw): NotificationType {
  const comp = (raw.component ?? '').toLowerCase();
  const evt = (raw.eventtype ?? '').toLowerCase();

  if (comp.includes('assign')) return evt.includes('graded') ? 'graded' : 'assignment';
  if (comp.includes('forum')) return 'forum';
  if (comp.includes('badge')) return 'badge';
  if (comp.includes('message') || comp.includes('chat')) return 'message';
  return 'system';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function mapNotification(raw: NotificationRaw): Notification {
  return {
    id: raw.id,
    type: inferType(raw),
    title: raw.subject || raw.smallmessage,
    body: stripHtml(raw.smallmessage || raw.fullmessage || raw.fullmessagehtml),
    timecreated: raw.timecreated,
    read: raw.timeread !== null && raw.timeread > 0,
    contexturl: raw.contexturl,
    userfromfullname: raw.userfromfullname,
    component: raw.component,
    eventtype: raw.eventtype,
  };
}

export default class MoodleNotificationApi implements INotificationApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getNotifications(token: string, userId: number, read: 0 | 1, limit = 50): Promise<Notification[]> {
    const response = await this.moodleClient.call<GetNotificationsResponse>(
      token,
      'core_message_get_messages',
      {
        useridto: String(userId),
        type: 'notifications',
        read: String(read),
        limitnum: String(limit),
        limitfrom: '0',
      },
    );

    return (response.messages ?? []).map(mapNotification);
  }

  async markAsRead(token: string, notificationId: number): Promise<void> {
    await this.moodleClient.call<unknown>(
      token,
      'core_message_mark_notification_read',
      {
        notificationid: String(notificationId),
        timeread: String(Math.floor(Date.now() / 1000)),
      },
    );
  }

  async markAllAsRead(token: string, userId: number): Promise<void> {
    await this.moodleClient.call<unknown>(
      token,
      'core_message_mark_all_notifications_as_read',
      {
        useridto: String(userId),
      },
    );
  }
}
