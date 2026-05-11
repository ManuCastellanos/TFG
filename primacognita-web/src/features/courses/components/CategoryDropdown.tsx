import { useDropdown } from '@/shared/hooks/useDropdown';
import { Input } from '@/components/ui/input/Input';
import type { CourseCategory } from '@/modules/course/domain/CourseCategory';

type Props = {
  categories: CourseCategory[];
  loading: boolean;
  onChange: (id: string) => void;
};

export const CategoryDropdown = ({ categories, loading, onChange }: Props) => {
  const { categorySearch, dropdownOpen, filteredCategories, containerRef, onSearchChange, onFocus, onSelect } =
    useDropdown(categories);

  const handleSelect = (category: CourseCategory) => {
    onSelect(category);
    onChange(category.id);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={categorySearch}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Categoría"
      />

      {dropdownOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-xl border bg-(--surface)">
          {loading ? (
            <p className="p-2 text-sm">Cargando…</p>
          ) : (
            filteredCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="w-full p-2 text-left hover:bg-(--surface-muted)"
                onClick={() => handleSelect(c)}
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
