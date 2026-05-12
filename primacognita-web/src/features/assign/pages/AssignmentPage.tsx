import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { useSession } from '@/shared/hooks/useSession';
import { isTeacherRole } from '@/modules/user/domain/User';
import { useAssignment } from '../hooks/useAssignment';
import { AssignPreview } from '../sections/AssignPreview';
import { AssignUpload } from '../sections/AssignUpload';
import { AssignSubmitted } from '../sections/AssignSubmitted';
import { usePageHeader } from '@/layouts/pageHeader.context';
import AssignmentReviewPage from './AssignmentReviewPage';

function AssignmentStudentView() {
  const navigate = useNavigate();
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };

  const { assignment, loading, error, refetch } = useAssignment(courseId, cmid);
  const [editing, setEditing] = useState(false);
  const { set: setPageHeader } = usePageHeader();

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
        <div className="size-14 shrink-0 rounded-2xl bg-violet-100 grid place-items-center text-2xl">📝</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Tarea</span>
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
        <span className="text-sm text-(--fg-muted)">Cargando…</span>
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

  if (!assignment) return null;

  const showUpload = editing || (assignment.isDraft && !assignment.isSubmitted);
  const showSubmitted = assignment.isSubmitted && !editing;

  const handleSubmitted = () => {
    setEditing(false);
    void refetch();
  };

  return (
    <Page>
      {showUpload ? (
        <AssignUpload assignment={assignment} onCancel={() => setEditing(false)} onSubmitted={handleSubmitted} />
      ) : showSubmitted ? (
        <AssignSubmitted assignment={assignment} onEdit={() => setEditing(true)} />
      ) : (
        <AssignPreview assignment={assignment} onStartUpload={() => setEditing(true)} />
      )}
    </Page>
  );
}

export default function AssignmentPage() {
  const { roleName } = useSession();
  return isTeacherRole(roleName) ? <AssignmentReviewPage /> : <AssignmentStudentView />;
}
