import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Banner } from '@/components/feedback/banner/Banner';
import { useAssignment } from '../hooks/useAssignment';
import { AssignPreview } from '../sections/AssignPreview';
import { AssignUpload } from '../sections/AssignUpload';
import { AssignSubmitted } from '../sections/AssignSubmitted';

export default function AssignmentPage() {
  const navigate = useNavigate();
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };

  const { assignment, loading, error, refetch } = useAssignment(courseId, cmid);
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="text-sm text-(--fg-muted)">Cargando...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col p-8">
        <Banner variant="error">{error}</Banner>
      </main>
    );
  }

  if (!assignment) return null;

  const showUpload = editing || (assignment.isDraft && !assignment.isSubmitted);
  const showSubmitted = assignment.isSubmitted && !editing;

  const handleSubmitted = () => {
    setEditing(false);
    void refetch();
  };

  return (
    <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          className="grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-(--tint-50) transition"
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-14 rounded-2xl bg-violet-100 grid place-items-center text-2xl shrink-0">📝</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Tarea</span>
          <h1 className="text-2xl font-extrabold text-(--fg) leading-tight truncate">{assignment.title}</h1>
        </div>
      </div>

      {showUpload ? (
        <AssignUpload
          assignment={assignment}
          onCancel={() => setEditing(false)}
          onSubmitted={handleSubmitted}
        />
      ) : showSubmitted ? (
        <AssignSubmitted
          assignment={assignment}
          onEdit={() => setEditing(true)}
        />
      ) : (
        <AssignPreview
          assignment={assignment}
          onStartUpload={() => setEditing(true)}
        />
      )}
    </main>
  );
}
