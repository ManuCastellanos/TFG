export type TopBarUser = {
  name: string;
  handle: string;
  avatarUrl?: string | null;
};

export type TopBarProps = {
  user: TopBarUser;
  onMessageClick?: () => void;
  onNotificationClick?: () => void;
  unreadCount?: number;
  unreadNotificationCount?: number;
};