export type NotificationType = 'assignment' | 'message' | 'badge' | 'graded' | 'forum' | 'system';

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  timecreated: number; // Unix timestamp en segundos
  read: boolean;
  contexturl?: string | null;
  userfromfullname?: string;
  component?: string;
  eventtype?: string;
};
