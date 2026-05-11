import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import FilterChip from './FilterChip';

type CoursesToolbarProps = {
  coursesCount: number;
  pendingCount: number;
  filter: 'todos' | 'pendientes';
  search: string;
  isTeacher: boolean;
  onFilterChange: (f: 'todos' | 'pendientes') => void;
  onSearchChange: (s: string) => void;
  onCreateCourse: () => void;
};

const CoursesToolbar = ({
  coursesCount,
  pendingCount,
  filter,
  search,
  isTeacher,
  onFilterChange,
  onSearchChange,
  onCreateCourse,
}: CoursesToolbarProps) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip
        label={`Todos · ${coursesCount}`}
        active={filter === 'todos'}
        onClick={() => onFilterChange('todos')}
      />
      <FilterChip
        label={`Sin completar · ${pendingCount}`}
        active={filter === 'pendientes'}
        onClick={() => onFilterChange('pendientes')}
      />
    </div>
    <div className="flex items-center gap-2">
      <Input
        variant="search"
        placeholder="Buscar curso..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />
      {isTeacher && (
        <Button size="md" onClick={onCreateCourse}>
          <Plus className="size-4" />
          Crear curso
        </Button>
      )}
    </div>
  </div>
);

export default CoursesToolbar;
