import { NavItem } from '@/components/navigation/NavItem';
import type { SidebarProps } from './sidebar.types';

export const Sidebar = ({ navItems, activePath, onNavigate }: SidebarProps) => (
  <aside className="flex h-full w-64 shrink-0 flex-col bg-(--sidebar-bg) px-4 py-6">
    <div className="mb-8 flex items-center px-4">
      <img src="/logo.png" alt="Prima Cognita" className="w-40" />
    </div>

    <nav className="flex flex-1 flex-col gap-1.5">
      {navItems.flatMap((item) =>
        item.id !== 'logout'
          ? [<NavItem key={item.id} item={item} isActive={activePath === item.path || (item.path.length > 1 && activePath.startsWith(item.path))} onClick={onNavigate} />]
          : []
      )}
      <div className="mt-auto">
        {navItems.flatMap((item) =>
          item.id === 'logout'
            ? [<NavItem key={item.id} item={item} danger onClick={onNavigate} />]
            : []
        )}
      </div>
    </nav>
  </aside>
);
