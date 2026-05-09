import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pencil, Plus, Search } from 'lucide-react';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { Banner } from '@/components/feedback/banner/Banner';
import { useCourses } from '../hooks/useCourses';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { useAllCategories } from '../hooks/useCourseCategories';
import {
  useCourseCustomization,
  COURSE_COLORS,
  COLOR_META,
} from '@/shared/hooks/useCourseCustomization';
import type { Course } from '@/modules/course/domain/Course';
import type { CreateCourseInput } from '@/modules/course/domain/CreateCourseInput';
import { dateStringToUnix } from '../utils/course.utils';

// ─── Color-only picker popover ────────────────────────────────────────────────

const CourseColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (c: string) => void;
}) => (
  <div
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
        {/* Cover — backend image or gradient fallback */}
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

        {/* Body */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div>
            <h3 className="font-extrabold text-(--fg) text-base leading-tight line-clamp-2 mb-1">
              {course.fullname}
            </h3>
            <p className={`text-xs font-bold ${c.text}`}>{course.shortname}</p>
          </div>
          <div>
            <div className="h-2 rounded-full bg-neutral-100 mb-1.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${c.grad}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-extrabold ${c.text}`}>{progress}% completado</span>
            </div>
          </div>
        </div>
      </button>

      {/* Color customize button */}
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

// ─── Create Course Modal ──────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-2xl border border-(--border) bg-white px-3.5 py-2.5 text-sm text-(--fg) placeholder:text-(--fg-subtle) focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

const FieldShell = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle)">
      {label}
      {required && <span className="text-orange-600 ml-0.5">*</span>}
    </span>
    {children}
    {hint && <span className="text-[11px] text-(--fg-muted)">{hint}</span>}
  </label>
);

type VisibilityState = 'hidden' | 'visible';

type CreateCourseModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

const CreateCourseModal = ({ onClose, onCreated }: CreateCourseModalProps) => {
  const { submit, loading, error } = useCreateCourse();
  const { categories, loading: loadingCats } = useAllCategories();

  const [fullname, setFullname] = useState('');
  const [shortname, setShortname] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [summary, setSummary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('20:00');
  const [visibility, setVisibility] = useState<VisibilityState>('hidden');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: CreateCourseInput = {
      fullname,
      shortname,
      categoryId: categoryId || null,
      summary: summary || null,
      visible: visibility === 'visible' ? 1 : 0,
      ...(startDate && { startdate: dateStringToUnix(`${startDate}T${startTime}`) }),
      ...(endDate && { enddate: dateStringToUnix(`${endDate}T${endTime}`) }),
    };
    await submit(input);
    onCreated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 backdrop-blur-sm p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-3xl border border-(--border) shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal header */}
        <div className="flex items-start gap-4 px-7 pt-6 pb-5 border-b border-(--border)">
          <div className="size-12 rounded-2xl bg-linear-to-br from-emerald-300 to-emerald-500 grid place-items-center text-white shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden>
              <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" />
              <path d="M4 17h14" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-(--fg) leading-tight">Crear curso</h2>
            <p className="text-sm text-(--fg-muted) mt-0.5">
              Define lo esencial. Podrás añadir temas y actividades después.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl bg-(--tint-100) hover:bg-(--tint-200) text-(--fg-muted) grid place-items-center text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <form
          id="create-course-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6"
        >
          {error && <Banner variant="error">{error}</Banner>}

          {/* Section 1 — Identity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="size-6 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-extrabold">
                1
              </span>
              <h3 className="font-extrabold text-(--fg)">Identidad</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldShell label="Nombre completo" required>
                <input
                  className={inputCls}
                  placeholder="Ej. 1ºA Matemáticas"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </FieldShell>
              <FieldShell label="Nombre corto" hint="Aparecerá en menús y migas de pan.">
                <input
                  className={inputCls}
                  placeholder="Ej. 1A-MAT"
                  value={shortname}
                  onChange={(e) => setShortname(e.target.value)}
                />
              </FieldShell>
              <FieldShell label="Categoría">
                <select
                  className={inputCls}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loadingCats}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <div className="col-span-2">
                <FieldShell label="Descripción" hint="Una o dos frases que verán los alumnos al entrar.">
                  <textarea
                    rows={2}
                    className={inputCls}
                    placeholder="Descripción del curso..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </FieldShell>
              </div>
            </div>
          </div>

          {/* Section 2 — Calendar & Visibility */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="size-6 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-extrabold">
                2
              </span>
              <h3 className="font-extrabold text-(--fg)">Calendario y visibilidad</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldShell label="Visible desde" hint="Cuándo aparece en la biblioteca de los alumnos.">
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <input
                    type="date"
                    className={inputCls}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className={inputCls}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </FieldShell>
              <FieldShell label="Cierre del curso" hint="Tras esta fecha pasa a «acabado» para los alumnos.">
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <input
                    type="date"
                    className={inputCls}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className={inputCls}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </FieldShell>
              <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl bg-(--tint-50) px-4 py-3 border border-(--border)">
                <div>
                  <div className="text-sm font-extrabold text-(--fg)">Estado al crear</div>
                  <p className="text-xs text-(--fg-muted)">
                    Puedes guardarlo oculto y publicarlo más tarde.
                  </p>
                </div>
                <div className="inline-flex p-1 bg-(--tint-100) rounded-2xl border border-(--border)">
                  {(['hidden', 'visible'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVisibility(v)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        visibility === v
                          ? 'bg-white text-(--fg) shadow-sm'
                          : 'text-(--fg-muted) hover:text-(--fg)'
                      }`}
                    >
                      {v === 'hidden' ? 'Oculto' : 'Visible ya'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-7 py-4 bg-(--tint-50) border-t border-(--border)">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-sm font-extrabold text-(--fg-muted) hover:bg-(--tint-100)"
          >
            Cancelar
          </button>
          <button
            form="create-course-form"
            type="submit"
            disabled={loading || !fullname}
            className="px-5 py-2.5 rounded-2xl text-sm font-extrabold text-white bg-[#274E38] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear curso'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
          <h1 className="text-2xl font-extrabold text-(--fg) leading-tight truncate min-w-0">Mis cursos</h1>
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
      {/* Filter chips + search + actions */}
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
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-2xl border border-(--border) bg-white pl-9 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:border-emerald-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--fg-muted)" />
          </div>
          {isTeacher && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 shadow-sm"
            >
              <Plus className="size-4" />
              Crear curso
            </button>
          )}
        </div>
      </div>

      {error && <Banner variant="error">{error}</Banner>}

      {loading ? (
        <p className="text-sm text-(--fg-muted)">Cargando cursos...</p>
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
