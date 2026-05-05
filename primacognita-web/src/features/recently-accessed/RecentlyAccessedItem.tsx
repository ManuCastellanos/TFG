import { Surface } from '@/components/surface/Surface';
import type { RecentlyAccessedItemVM } from './RecentlyAccessed.types';

interface Props {
  item: RecentlyAccessedItemVM;
  onClick?: () => void;
}

export const RecentlyAccessedItem = ({ item, onClick }: Props) => (
  <Surface
    as="button"
    onClick={onClick}
    className="flex w-full items-center gap-4 px-4 py-3 text-left shadow-md transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-(--color-pr)"
  >
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${item.accentColor}`}
    >
      {item.code}
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-sm font-semibold text-(--fg)">{item.title}</span>
      <span className="truncate text-xs text-(--fg-muted)">
        {item.time}
        <span className="mx-1.5 opacity-40">|</span>
        {item.subtitle}
      </span>
    </div>
  </Surface>
);
