import type { RecentlyAccessedItemVM } from '../types/recentlyAccessed.types';

interface Props {
  item: RecentlyAccessedItemVM;
  onClick?: () => void;
}

export const RecentlyAccessedItem = ({ item, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-(--tint-50) focus-visible:outline-2 focus-visible:outline-(--color-pr)"
  >
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${item.accentSoft}`}
    >
      {item.emoji}
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-sm font-bold text-(--fg)">{item.title}</span>
      <span className="truncate text-xs text-(--fg-muted)">
        {item.time}
        <span className="mx-1 opacity-40">·</span>
        {item.subtitle}
      </span>
    </div>
  </button>
);
