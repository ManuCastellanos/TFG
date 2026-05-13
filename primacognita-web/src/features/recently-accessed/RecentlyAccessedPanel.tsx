import { Button } from '@/components/ui/button/Button';
import { useRecentlyAccessed } from './hooks/useRecentlyAccessed';
import { RecentlyAccessedItem } from './components/RecentlyAccessedItem';

export function RecentlyAccessedPanel() {
  const { viewModels, handleItemClick } = useRecentlyAccessed();
  const visible = viewModels.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-(--fg)">Sigue por aquí</h3>
        <Button variant="success" size="sm" type="button">
          Ver todo
        </Button>
      </div>
      <ul className="flex flex-col gap-1">
        {visible.length === 0 ? (
          <li className="text-sm text-(--fg-subtle) px-2 py-1">Sin actividad reciente.</li>
        ) : (
          visible.map((item) => (
            <li key={item.id}>
              <RecentlyAccessedItem item={item} onClick={() => handleItemClick(item)} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
