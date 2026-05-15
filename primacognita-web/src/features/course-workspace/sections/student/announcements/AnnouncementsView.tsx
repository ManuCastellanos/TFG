import { useState, useMemo } from 'react';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import { SectionListSkeleton } from '@/components/patterns/sectionSkeleton/SectionListSkeleton';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { Alert } from '@/components/ui/alert/Alert';
import { Button } from '@/components/ui/button/Button';
import { useSession } from '@/shared/hooks/useSession';
import { isTeacherRole } from '@/modules/user/domain/User';
import { useForumByCourse, useForumDiscussions, useAddDiscussion } from './hooks/useAnnouncements';
import { ArticleCard } from './components/ArticleCard';
import { NewDiscussionForm } from './components/NewDiscussionForm';

type Filter = 'all' | 'pinned' | 'week';

type AnnouncementsViewProps = {
  courseId: string;
};

export function AnnouncementsView({ courseId }: AnnouncementsViewProps) {
  const { roleName } = useSession();
  const isTeacher = isTeacherRole(roleName);

  const {
    data: forums,
    isLoading: loadingForums,
    isError: forumsError,
    error: forumsErrorMsg,
  } = useForumByCourse(courseId);
  const forum = forums?.find((f) => f.type === 'news') ?? forums?.[0] ?? null;
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
    if (!forum) return;
    await addDiscussion.mutateAsync({ subject, message });
    setShowNewForm(false);
  };

  if (loadingForums) {
    return <SectionListSkeleton />;
  }

  if (forumsError) {
    return <Alert variant="error">Error cargando foros: {String(forumsErrorMsg)}</Alert>;
  }

  if (!forum) {
    return (
      <EmptyState
        emoji="📣"
        title="Sin foro de anuncios"
        subtitle="Este curso no tiene un foro de anuncios configurado."
      />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <div className="flex flex-col gap-4">
        {isTeacher && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--fg)">{forum.name}</h2>
            {!showNewForm && <Button onClick={() => setShowNewForm(true)}>Nuevo anuncio</Button>}
          </div>
        )}

        {addDiscussion.error && <Alert variant="error">{(addDiscussion.error as Error).message}</Alert>}

        {isTeacher && showNewForm && (
          <NewDiscussionForm onSubmit={handleNewDiscussion} onCancel={() => setShowNewForm(false)} />
        )}

        {loadingDiscussions ? (
          <SectionListSkeleton rows={3} />
        ) : isDiscussionsError ? (
          <Alert variant="error">Error cargando discusiones: {String(discussionsError)}</Alert>
        ) : filtered.length === 0 ? (
          <EmptyState
            emoji="📭"
            title={filter !== 'all' ? 'Sin resultados' : 'Sin anuncios'}
            subtitle={filter !== 'all' ? 'No hay anuncios con este filtro.' : 'Sé el primero en publicar un anuncio.'}
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
          <h4 className="font-extrabold text-(--fg) mb-2 text-sm">¿Has visto?</h4>
          <p className="text-xs text-(--fg-muted) leading-relaxed">
            Aquí encontrarás todos los avisos importantes de tu profe. Cuando haya uno nuevo, te avisaremos con la
            campanita 🔔.
          </p>
        </div>
      </aside>
    </div>
  );
}
