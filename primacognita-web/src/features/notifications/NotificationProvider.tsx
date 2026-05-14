import { useState, useCallback } from 'react';
import { NotificationContext } from './notificationContext';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <NotificationContext value={{ isOpen, open, close, toggle }}>
      {children}
    </NotificationContext>
  );
}
