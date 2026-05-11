import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pencil, Plus } from 'lucide-react';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { Banner } from '@/components/feedback/banner/Banner';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import ProgressBar from '@/components/ui/progressBar/ProgressBar';
import { useCourses } from '../hooks/useCourses';
import {
  useCourseCustomization,
  COURSE_COLORS,
  COLOR_META,
} from '@/shared/hooks/useCourseCustomization';
import { CreateCourseModal } from '../components/CreateCourseModal';
import type { Course } from '@/modules/course/domain/Course';

// ─── Color-only picker popover ────────────────────────────────────────────────

const CourseColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (c: string) => void;
}) => (
  <div
    role="presentation"
    className="absolute top-10 right-2 z-30 bg-white rounded-2xl p-3 shadow-2xl border border-(--border)"
    onClick={(e) => e.stopPropagation()}
  >
    <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-2">Color</p>
    <div className="flex flex-wrap gap-2">
      {COURSE_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={(ev) => { ev.stopPropagation(); onColorChange(c); }}
          className={`size-5 rounded-full ${COLOR_META[c].solid} transition hover:scale-110 ${color === c ? 'ring-2 ring-offset-1 ring-[#274E38]' : ''}`}
        />
      ))}
    </div>
  </div>
);

// ─── Course library card ──────────────────────────────────────────────────────

const CourseLibCard = ({
  course,
  index,
  onClick,
}: {
  course: Course;
  index: number;
  onClick: () => void;
}) => {
  const progress = course.progress ?? 0;
  const { color, update } = useCourseCustomization(course.id, index);
  const c = COLOR_META[color];
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [pickerOpen]);

  return (
    <div ref={wrapRef} className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex flex-col rounded-3xl overflow-hidden border-2 border-(--border) bg-white text-left transition hover:shadow-md hover:-translate-y-0.5 ${c.hover}`}
      >
        <div className="relative h-32 overflow-hidden">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-linear-to-br ${c.grad} grid place-items-center`}>
              <span className="text-5xl font-extrabold text-white/70">
                {course.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {course.completed && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm">
              ✓ Completado
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-(--fg) text-base leading-tight line-clamp-2 mb-1">
              {course.fullname}
            </h3>
            <p className={`text-xs font-bold ${c.text}`}>{course.shortname}</p>
          </div>
          <div>
            <ProgressBar.Core value={progress} colorClass={c.grad} height="h-2" className="mb-1.5" />
            <div className="flex items-center justify-between text-xs">
              <span className={`font-extrabold ${c.text}`}>{progress}% completado</span>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label="Personalizar color del curso"
        onClick={(e) => { e.stopPropagation(); setPickerOpen((v) => !v); }}
        className="absolute top-2 right-2 size-7 rounded-xl bg-white border border-(--border) grid place-items-center text-(--fg-muted) opacity-0 group-hover:opacity-100 transition z-10 shadow-sm hover:bg-(--tint-50)"
        style={{ opacity: pickerOpen ? 1 : undefined }}
      >
        <Pencil className="size-3.5" />
      </button>

      {pickerOpen && (
        <CourseColorPicker
          color={color}
          onColorChange={(newColor) => update({ color: newColor as typeof COURSE_COLORS[number] })}
        />
      )}
    </div>
  );
};

// ─── Filter chip ──────────────────────────────────────────────────────────────

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-sm transition border-2 ${
      active
        ? 'bg-[#274E38] text-white border-[#274E38]'
        : 'bg-white text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
    }`}
  >
    {label}
  </button>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, loading, error, isTeacher } = useCourses();
  const [filter, setFilter] = useState<'todos' | 'pendientes'>('todos');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { set: setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Tu biblioteca</span>
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">Mis cursos</h1>
        </div>
      </div>,
    );
    return () => setPageHeader(null);
  }, []);

  const filtered = courses.filter((c) => {
    const matchesSearch =
      !search ||
      c.fullname.toLowerCase().includes(search.toLowerCase()) ||
      c.shortname.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'todos' || (filter === 'pendientes' && !c.completed);
    return matchesSearch && matchesFilter;
  });

  const pendingCount = courses.filter((c) => !c.completed).length;

  return (
    <main className="flex flex-1 flex-col overflow-y-auto px-8 pt-5 pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label={`Todos · ${courses.length}`}
            active={filter === 'todos'}
            onClick={() => setFilter('todos')}
          />
          <FilterChip
            label={`Sin completar · ${pendingCount}`}
            active={filter === 'pendientes'}
            onClick={() => setFilter('pendientes')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            variant="search"
            placeholder="Buscar curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          {isTeacher && (
            <Button size="md" onClick={() => setShowModal(true)}>
              <Plus className="size-4" />
              Crear curso
            </Button>
          )}
        </div>
      </div>

      {error && <Banner variant="error">{error}</Banner>}

      {loading ? (
        <p className="text-sm text-(--fg-muted)">Cargando cursos…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-(--fg-subtle)">No hay cursos que coincidan.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 content-start">
          {filtered.map((course, i) => (
            <CourseLibCard
              key={course.id}
              course={course}
              index={i}
              onClick={() => navigate({ to: '/courses/$id', params: { id: course.id } })}
            />
          ))}
          {isTeacher && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="group flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-(--border) bg-white/40 text-(--fg-muted) hover:border-emerald-400 hover:bg-white hover:text-emerald-700 transition min-h-[280px] p-6"
            >
              <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center group-hover:bg-emerald-200">
                <Plus className="size-6" />
              </div>
              <div className="text-base font-extrabold">Crear curso</div>
              <p className="text-xs text-center max-w-45 leading-snug">
                Configura nombre, fechas, visibilidad y portada.
              </p>
            </button>
          )}
        </div>
      )}

      {showModal && (
        <CreateCourseModal onClose={() => setShowModal(false)} onCreated={() => setShowModal(false)} />
      )}
    </main>
  );
}
