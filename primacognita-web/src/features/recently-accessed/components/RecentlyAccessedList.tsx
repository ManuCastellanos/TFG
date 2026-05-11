import { RecentlyAccessedItem } from './RecentlyAccessedItem';
import type { RecentlyAccessedItemVM } from '../types/recentlyAccessed.types';

interface Props {
  items: RecentlyAccessedItemVM[];
  onItemClick?: (id: string) => void;
}

export const RecentlyAccessedList = ({ items, onItemClick }: Props) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <RecentlyAccessedItem key={item.id} item={item} onClick={() => onItemClick?.(item.id)} />
    ))}
  </div>
);
