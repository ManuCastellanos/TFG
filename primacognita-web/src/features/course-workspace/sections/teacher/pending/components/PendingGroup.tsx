import { PendingRow } from './PendingRow';
import type { EnrichedPendingItem } from '../hooks/useTeacherPending';

type Props = {
  title: string;
  hint: string | null;
  items: EnrichedPendingItem[];
  onItemClick: (item: EnrichedPendingItem) => void;
};

export function PendingGroup({ title, hint, items, onItemClick }: Props) {
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-2.5 px-1">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">{title}</h3>
        <span className="text-[11px] font-bold text-(--fg-subtle)">· {items.length}</span>
        {hint && <span className="text-[11px] text-(--fg-subtle) font-bold ml-auto">{hint}</span>}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <PendingRow
            key={`${item.assignId}-${item.userId}`}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </section>
  );
}
