import { useEffect, useRef, useState } from 'react';
import type { CourseCategory } from '@/modules/course/domain/CourseCategory';

interface UseDropdownResult {
  categoryId: string | null;
  categorySearch: string;
  dropdownOpen: boolean;
  filteredCategories: CourseCategory[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onSelect: (category: CourseCategory) => void;
}

export function useDropdown(categories: CourseCategory[]): UseDropdownResult {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const onSearchChange = (value: string) => {
    setCategorySearch(value);
    setCategoryId(null);
    setDropdownOpen(true);
  };

  const onFocus = () => setDropdownOpen(true);

  const onSelect = (category: CourseCategory) => {
    setCategoryId(category.id);
    setCategorySearch(category.name);
    setDropdownOpen(false);
  };

  return {
    categoryId,
    categorySearch,
    dropdownOpen,
    filteredCategories,
    containerRef,
    onSearchChange,
    onFocus,
    onSelect,
  };
}
