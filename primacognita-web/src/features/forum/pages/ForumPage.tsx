import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { SectionListSkeleton } from '@/components/patterns/sectionSkeleton/SectionListSkeleton';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import {
  useForumByCourse,
  useForumDiscussions,
  useAddDiscussion,
} from '@/features/course-workspace/sections/student/announcements/hooks/useAnnouncements';
import { ArticleCard } from '@/features/course-workspace/sections/student/announcements/components/ArticleCard';
import { NewDiscussionForm } from '@/features/course-workspace/sections/student/announcements/components/NewDiscussionForm';

type Filter = 'all' | 'pinned' | 'week';

export default function ForumPage() {
  const navigate = useNavigate();
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };
  const { set: setPageHeader } = usePageHeader();

  const { data: forums, isLoading: loadingForums } = useForumByCourse(courseId);
  const forum = forums?.find((f) => f.cmid === Number(cmid)) ?? null;

  const {
    data: discussions,
    isLoading: loadingDiscussions,
    isError: isDiscussionsError,
    error: discussionsError,
  } = useForumDiscussions(forum?.id ?? null);

  const addDiscussion = useAddDiscussion(forum?.id ?? 0);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const now = useTimeNow();

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="size-14 shrink-0 rounded-2xl bg-emerald-100 grid place-items-center text-2xl">💬</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Foro</span>
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">
            {forum?.name ?? (loadingForums ? '…' : 'Foro')}
          </h1>
        </div>
      </div>,
    );
    return () => setPageHeader(null);
  }, [forum?.name, courseId, loadingForums]);

  const filtered = useMemo(() => {
    if (!discussions) return [];
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    return discussions.filter((d) => {
      if (filter === 'pinned') return d.pinned;
      if (filter === 'week') return d.created * 1000 >= weekAgo;
      return true;
    });
  }, [discussions, filter, now]);

  const handleNewDiscussion = async (subject: string, message: string) => {
    await addDiscussion.mutateAsync({ subject, message });
    setShowNewForm(false);
  };

  if (loadingForums) {
    return (
      <Page>
        <SectionListSkeleton />
      </Page>
    );
  }

  if (!forum) {
    return (
      <Page>
        <EmptyState emoji="💬" title="Foro no encontrado" subtitle="No se ha encontrado este foro en el curso." />
      </Page>
    );
  }

  return (
    <Page>
      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--fg)">{forum.name}</h2>
            {!showNewForm && (
              <Button onClick={() => setShowNewForm(true)}>Nueva discusión</Button>
            )}
          </div>

          {addDiscussion.error && (
            <Alert variant="error">{(addDiscussion.error as Error).message}</Alert>
          )}

          {showNewForm && (
            <NewDiscussionForm onSubmit={handleNewDiscussion} onCancel={() => setShowNewForm(false)} />
          )}

          {loadingDiscussions ? (
            <SectionListSkeleton rows={3} />
          ) : isDiscussionsError ? (
            <Alert variant="error">Error cargando discusiones: {String(discussionsError)}</Alert>
          ) : filtered.length === 0 ? (
            <EmptyState
              emoji="📭"
              title={filter !== 'all' ? 'Sin resultados' : 'Sin discusiones'}
              subtitle={
                filter !== 'all'
                  ? 'No hay discusiones con este filtro.'
                  : 'Sé el primero en publicar una discusión.'
              }
            />
          ) : (
            filtered.map((d) => <ArticleCard key={d.id} discussion={d} />)
          )}
        </div>

        <aside className="flex flex-col gap-3">
          <div className="bg-white rounded-3xl border border-(--border) p-5">
            <h4 className="font-extrabold text-(--fg) mb-3 text-sm">Filtrar</h4>
            <div className="flex flex-col gap-1.5">
              {[
                { key: 'all' as const, label: 'Todos' },
                { key: 'pinned' as const, label: 'Destacados' },
                { key: 'week' as const, label: 'De esta semana' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`text-left text-sm font-bold px-3 py-2 rounded-xl transition ${
                    filter === f.key ? 'bg-[#274E38] text-white' : 'text-(--fg-muted) hover:bg-(--tint-100)'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-(--border) p-5">
            <h4 className="font-extrabold text-(--fg) mb-2 text-sm">Sobre este foro</h4>
            <p className="text-xs text-(--fg-muted) leading-relaxed">
              Aquí puedes participar en las discusiones del foro. Crea nuevos temas o responde a los existentes.
            </p>
          </div>
        </aside>
      </div>
    </Page>
  );
}
