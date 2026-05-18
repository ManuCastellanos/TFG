import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/theme/ThemeContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="grid size-10 place-items-center rounded-2xl bg-(--surface) border border-(--border) text-(--fg) hover:bg-(--surface-muted) transition"
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
