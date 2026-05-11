import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { Button } from '@/components/ui/button/Button';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { StepBadge } from '@/components/ui/stepBadge/StepBadge';
import { FormField } from '@/components/ui/formField/FormField';
import { Alert } from '@/components/ui/alert/Alert';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { useAllCategories } from '../hooks/useCourseCategories';
import { dateStringToUnix } from '../utils/course.utils';
import type { CreateCourseInput } from '@/modules/course/domain/CreateCourseInput';

const inputCls =
  'w-full rounded-2xl border border-(--border) bg-white px-3.5 py-2.5 text-sm text-(--fg) placeholder:text-(--fg-subtle) focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

type VisibilityState = 'hidden' | 'visible';

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export function CreateCourseModal({ onClose, onCreated }: Props) {
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
    <Modal open onClose={onClose} width="lg">
      <Modal.Header
        icon={
          <AvatarBox gradient="emerald" size="size-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden>
              <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" />
              <path d="M4 17h14" />
            </svg>
          </AvatarBox>
        }
        title="Crear curso"
        subtitle="Define lo esencial. Podrás añadir temas y actividades después."
        onClose={onClose}
      />

      <form
        id="create-course-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6"
      >
        {error && <Alert variant="error">{error}</Alert>}

        {/* Sección 1 — Identidad */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <StepBadge step={1} color="emerald" size="sm" />
            <h3 className="font-semibold text-(--fg)">Identidad</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre completo" required>
              <input
                className={inputCls}
                placeholder="Ej. 1ºA Matemáticas"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Nombre corto" hint="Aparecerá en menús y migas de pan.">
              <input
                className={inputCls}
                placeholder="Ej. 1A-MAT"
                value={shortname}
                onChange={(e) => setShortname(e.target.value)}
              />
            </FormField>
            <FormField label="Categoría">
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
            </FormField>
            <div className="col-span-2">
              <FormField label="Descripción" hint="Una o dos frases que verán los alumnos al entrar.">
                <textarea
                  rows={2}
                  className={inputCls}
                  placeholder="Descripción del curso..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Sección 2 — Calendario y visibilidad */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <StepBadge step={2} color="emerald" size="sm" />
            <h3 className="font-semibold text-(--fg)">Calendario y visibilidad</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Visible desde" hint="Cuándo aparece en la biblioteca de los alumnos.">
              <div className="grid grid-cols-[1fr_100px] gap-2">
                <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </FormField>
            <FormField label="Cierre del curso" hint="Tras esta fecha pasa a «acabado» para los alumnos.">
              <div className="grid grid-cols-[1fr_100px] gap-2">
                <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <input type="time" className={inputCls} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </FormField>
            <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl bg-(--tint-50) px-4 py-3 border border-(--border)">
              <div>
                <div className="text-sm font-extrabold text-(--fg)">Estado al crear</div>
                <p className="text-xs text-(--fg-muted)">Puedes guardarlo oculto y publicarlo más tarde.</p>
              </div>
              <div className="inline-flex p-1 bg-(--tint-100) rounded-2xl border border-(--border)">
                {(['hidden', 'visible'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                      visibility === v ? 'bg-white text-(--fg) shadow-sm' : 'text-(--fg-muted) hover:text-(--fg)'
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

      <Modal.Footer>
        <Button variant="ghost" size="md" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          form="create-course-form"
          type="submit"
          size="md"
          disabled={loading || !fullname}
        >
          {loading ? 'Creando...' : 'Crear curso'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
