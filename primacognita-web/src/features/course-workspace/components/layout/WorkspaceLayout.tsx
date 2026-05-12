import type { ReactNode } from 'react';
import { Page } from '@/components/ui/page/Page';

type WorkspaceLayoutProps = {
  banner: ReactNode;
  tabs: ReactNode;
  content: ReactNode;
  sidebar: ReactNode;
};

export const WorkspaceLayout = ({ banner, tabs, content, sidebar }: WorkspaceLayoutProps) => (
  <Page>
    {banner}
    {tabs}
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div className="flex flex-col gap-3 min-w-0">{content}</div>
      <div className="flex flex-col gap-4">{sidebar}</div>
    </div>
  </Page>
);
