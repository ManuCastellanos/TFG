import { createContext, use } from 'react';

type NotificationContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const NotificationContext = createContext<NotificationContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useNotificationDrawer = () => use(NotificationContext);
