import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { Button } from '@/components/ui/button/Button';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { LoadingState } from '@/components/patterns/loadingState/LoadingState';
import { useSession } from '@/shared/hooks/useSession';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { useAssignmentReview } from '../hooks/useAssignmentReview';
import { formatRelativeDate } from '@/shared/utils/formatRelativeDate';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { StudentSubmission, StudentSubmissionStatus } from '@/modules/assignment/domain/StudentSubmission';

function withToken(url: string, token: string): string {
  if (url.includes('token=')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}token=${token}`;
}

const STATUS_META: Record<StudentSubmissionStatus, { label: string; pillClass: string; icon: string }> = {
  graded: { label: 'Calificado', pillClass: 'bg-emerald-100 text-emerald-800', icon: '⭐' },
  submitted: { label: 'Por revisar', pillClass: 'bg-orange-100 text-orange-800', icon: '📤' },
  late: { label: 'Tarde', pillClass: 'bg-amber-100 text-amber-800', icon: '⏰' },
  missing: { label: 'Sin entregar', pillClass: 'bg-rose-100 text-rose-800', icon: '📭' },
};

type FilterId = 'todos' | 'submitted' | 'graded' | 'missing';

function formatGrade(raw: string | undefined): string {
  if (!raw) return '—';
  const n = parseFloat(raw);
  return isNaN(n) ? '—' : n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

type GradingPanelProps = {
  sub: StudentSubmission;
  maxGrade: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onSave: (grade: number, feedback: string) => void;
  saving: boolean;
};

function GradingPanel({ sub, maxGrade, onPrev, onNext, hasPrev, hasNext, onSave, saving }: GradingPanelProps) {
  const { token } = useSession();
  const color = SECTION_COLORS[sub.colorIdx % SECTION_COLORS.length];
  const [gradeInput, setGradeInput] = useState(() => (sub.gradeStr ? formatGrade(sub.gradeStr) : ''));
  const [feedback, setFeedback] = useState('');

  const gradeValue = parseFloat(gradeInput.replace(',', '.'));
  const isValid = !isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= maxGrade;

  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6 sticky top-4 self-start">
      <div className="flex items-center gap-3 mb-5">
        <AvatarBox gradient={color.grad} size="size-12">
          {sub.userInitials}
        </AvatarBox>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-(--fg) leading-tight truncate">{sub.userFullName}</h3>
          <div className="text-xs text-(--fg-muted)">
            {sub.submittedAt ? `Entregado ${formatRelativeDate(sub.submittedAt)}` : 'Sin entrega'}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="size-8 rounded-lg bg-(--tint-50) hover:bg-(--tint-100) text-(--fg-muted) grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Alumno anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="size-8 rounded-lg bg-(--tint-50) hover:bg-(--tint-100) text-(--fg-muted) grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Alumno siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {sub.files.length > 0 ? (
        <div className="rounded-2xl border border-(--border) bg-(--tint-50) p-4 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-2">Archivos entregados</div>
          <div className="flex flex-col gap-2">
            {sub.files.map((f) => (
              <div key={f.fileUrl ?? f.filename} className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-100 text-rose-700 grid place-items-center text-lg shrink-0">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-(--fg) truncate">{f.filename}</div>
                  <div className="text-xs text-(--fg-muted)">
                    {f.fileSize > 0 ? `${(f.fileSize / 1024 / 1024).toFixed(1)} MB` : '—'}
                  </div>
                </div>
                <a
                  href={token ? withToken(f.fileUrl, token) : f.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-(--border) text-xs font-extrabold hover:bg-(--tint-100) shrink-0"
                >
                  Abrir
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-(--border) bg-(--tint-50) p-4 mb-4 text-center">
          <p className="text-sm text-(--fg-muted)">Sin archivos adjuntos</p>
        </div>
      )}

      {sub.note && (
        <div className="rounded-2xl border border-(--border) bg-(--tint-50) p-4 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">Nota del alumno</div>
          <p className="text-sm text-(--fg)">{sub.note}</p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="grade-input" className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle) block mb-2">
          Calificación · sobre {maxGrade}
        </label>
        <input
          id="grade-input"
          type="text"
          inputMode="decimal"
          value={gradeInput}
          onChange={(e) => setGradeInput(e.target.value)}
          placeholder={`0–${maxGrade}`}
          className="w-full rounded-2xl border border-(--border) bg-white px-4 py-3 text-2xl font-extrabold text-(--fg) focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="feedback-input" className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle) block mb-2">
          Comentario para el alumno
        </label>
        <textarea
          id="feedback-input"
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe un comentario de feedback…"
          className="w-full rounded-2xl border border-(--border) bg-(--tint-50) px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!isValid || saving}
        onClick={() => onSave(gradeValue, feedback, true)}
      >
        {saving ? (
          <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        Calificar
      </Button>
    </div>
  );
}

export default function AssignmentReviewPage() {
  const navigate = useNavigate();
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };
  const { token } = useSession();
  const { set: setPageHeader } = usePageHeader();

  const { assignment, submissions, loading, error, saving, saveGrade } = useAssignmentReview(
    token,
    courseId,
    cmid,
  );

  const [filter, setFilter] = useState<FilterId>('todos');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      submissions.filter((s) => {
        if (filter === 'submitted') return s.status === 'submitted' || s.status === 'late';
        if (filter === 'graded') return s.status === 'graded';
        if (filter === 'missing') return s.status === 'missing';
        return true;
      }),
    [submissions, filter],
  );

  const selectedSub = useMemo(() => {
    if (selectedUserId !== null) {
      const found = filtered.find((s) => s.userId === selectedUserId);
      if (found) return found;
    }
    return filtered.find((s) => s.status === 'submitted' || s.status === 'late') ?? filtered[0] ?? null;
  }, [filtered, selectedUserId]);

  useEffect(() => {
    setPageHeader(

      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-(--tint-50) transition"
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-14 shrink-0 rounded-2xl bg-violet-100 grid place-items-center text-2xl">📝</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Tarea · Calificar</span>
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">
            {assignment?.title ?? (loading ? '…' : 'Tarea')}
          </h1>
        </div>
      </div>,
    );
    return () => setPageHeader(null);
  }, [assignment?.title, courseId, loading]);

  if (loading) {
    return (
      <Page>
        <LoadingState label="Cargando entregas…" className="py-8" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert variant="error">{error}</Alert>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert variant="error">{error}</Alert>
      </Page>
    );
  }

  const counts = {
    todos: submissions.length,
    submitted: submissions.filter((s) => s.status === 'submitted' || s.status === 'late').length,
    graded: submissions.filter((s) => s.status === 'graded').length,
    missing: submissions.filter((s) => s.status === 'missing').length,
  };

  const selectedIdx = selectedSub ? filtered.indexOf(selectedSub) : -1;

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'submitted', label: 'Por revisar' },
    { id: 'graded', label: 'Calificadas' },
    { id: 'missing', label: 'Sin entregar' },
  ];

  return (
    <Page>
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="rounded-2xl bg-white border border-(--border) p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Alumnos</div>
          <div className="text-2xl font-extrabold text-(--fg) mt-1">{counts.todos}</div>
        </div>
        <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-800/80">Por revisar</div>
          <div className="text-2xl font-extrabold text-orange-900 mt-1">{counts.submitted}</div>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800/80">Calificadas</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{counts.graded}</div>
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800/80">Sin entregar</div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">{counts.missing}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-sm transition border-2 ${
              filter === f.id
                ? 'bg-[#274E38] text-white border-[#274E38]'
                : 'bg-white text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-md ${
                filter === f.id ? 'bg-white/20 text-white' : 'bg-(--tint-100) text-(--fg-muted)'
              }`}
            >
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="📭" title="No hay entregas en esta categoría." />
      ) : (
        <div className="grid grid-cols-[1fr_400px] gap-6 items-start">
          <div className="bg-white rounded-3xl border border-(--border) overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_140px_80px] gap-4 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) bg-(--tint-50) border-b border-(--border)">
              <span>Alumno</span>
              <span>Estado</span>
              <span>Entregado</span>
              <span className="text-right">Nota</span>
            </div>
            <div className="flex flex-col">
              {filtered.map((s) => {
                const color = SECTION_COLORS[s.colorIdx % SECTION_COLORS.length];
                const meta = STATUS_META[s.status];
                const active = s.userId === selectedSub?.userId;
                return (
                  <button
                    key={s.userId}
                    type="button"
                    onClick={() => setSelectedUserId(s.userId)}
                    className={`grid grid-cols-[1fr_120px_140px_80px] gap-4 items-center px-5 py-3 text-left border-b border-(--border) last:border-0 transition ${
                      active ? 'bg-emerald-50' : 'hover:bg-(--tint-50)'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AvatarBox gradient={color.grad} size="size-9" radius="rounded-xl">
                        {s.userInitials}
                      </AvatarBox>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-(--fg) truncate">{s.userFullName}</div>
                        <div className="text-xs text-(--fg-muted)">
                          {s.files.length > 0
                            ? `${s.files.length} archivo${s.files.length > 1 ? 's' : ''}`
                            : 'Sin archivos'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 w-fit flex items-center gap-1 ${meta.pillClass}`}
                    >
                      <span>{meta.icon}</span>
                      {meta.label}
                    </span>
                    <span className="text-xs text-(--fg-muted) font-bold">
                      {s.submittedAt ? formatRelativeDate(s.submittedAt) : '—'}
                    </span>
                    <span className="text-right font-extrabold text-(--fg)">
                      {s.gradeStr ? formatGrade(s.gradeStr) : '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSub && (
            <GradingPanel
              key={selectedSub.userId}
              sub={selectedSub}
              maxGrade={assignment?.maxGrade ?? 10}
              hasPrev={selectedIdx > 0}
              hasNext={selectedIdx < filtered.length - 1}
              onPrev={() => setSelectedUserId(filtered[selectedIdx - 1]?.userId ?? null)}
              onNext={() => setSelectedUserId(filtered[selectedIdx + 1]?.userId ?? null)}
              onSave={(grade, feedback) => void saveGrade(selectedSub.userId, grade, feedback)}
              saving={saving}
            />
          )}
        </div>
      )}
    </Page>
  );
}
