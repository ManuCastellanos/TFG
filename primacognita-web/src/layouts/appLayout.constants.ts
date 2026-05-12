import { LayoutDashboard, User, Calendar as CalendarIcon, BookOpen, Settings, LogOut } from 'lucide-react';
import type { NavItemConfig } from '@/components/navigation/navItem.types';

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  { id: 'schedule', label: 'Horario', icon: CalendarIcon, path: '/schedule' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, path: '/courses' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, path: '/logout' },
];
