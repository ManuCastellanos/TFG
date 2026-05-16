import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { useSession } from '@/shared/hooks/useSession';
import { isTeacherRole } from '@/modules/user/domain/User';
import { useAssignment } from '../hooks/useAssignment';
import { AssignPreview } from '../sections/AssignPreview';
import { AssignUpload } from '../sections/AssignUpload';
import { AssignSubmitted } from '../sections/AssignSubmitted';
import AssignmentReviewPage from './AssignmentReviewPage';

function AssignmentStudentView() {
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };

  const { assignment, loading, error, refetch } = useAssignment(courseId, cmid);
  const [editing, setEditing] = useState(false);

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
