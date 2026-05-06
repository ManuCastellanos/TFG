import { useMemo } from 'react';
import { Card } from '@/components/ui/card/Card';
import { SectionHeader } from '@/components/layout/sectionHeader/SectionHeader';
import { useSession } from '@/shared/hooks/useSession';
import { useRecentlyAccessedItems } from '@/shared/hooks/useRecentlyAccessedItems';
import { RecentlyAccessedList } from './RecentlyAccessedList';
import { toRecentlyAccessedItemVM } from './rAccessed.utils';

export function RecentlyAccessedPanel() {
  const { token } = useSession();
  const { items } = useRecentlyAccessedItems(token);
  const viewModels = useMemo(() => items.map(toRecentlyAccessedItemVM), [items]);

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="Sigue por aquí" />
      <Card className="p-4">
        <RecentlyAccessedList
          items={viewModels}
          onItemClick={(id) => {
            const entry = viewModels.find((i) => i.id === id);
            if (entry?.viewUrl) window.open(entry.viewUrl, '_blank');
          }}
        />
      </Card>
    </section>
  );
}
