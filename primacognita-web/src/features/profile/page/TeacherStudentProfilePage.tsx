import { useState } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { Page } from '@/components/ui/page/Page';
import { Alert } from '@/components/ui/alert/Alert';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { isTeacherRole } from '@/modules/user/domain/User';
import type { User } from '@/modules/user/domain/User';
import type { ProfileTutor } from '@/modules/profile/domain/Profile';
import { useParticipants } from '@/features/course-workspace/sections/student/participants/hooks/useParticipants';
import { useProfile } from '../hooks/useProfile';
import { useProfileActions } from '../hooks/useProfileActions';
import { StudentProfileView } from './StudentProfileView';
import { EditFamilyModal } from '../components/EditFamilyModal';
import { FamilyContactModal } from '../components/FamilyContactModal';

const TeacherStudentProfilePage = () => {
  const { userId: studentId } = useParams({ strict: false }) as { userId: string };
  const { courseId } = useSearch({ strict: false }) as { courseId?: string };
  const { token, roleName } = useSession();

  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [contactTutor, setContactTutor]     = useState<ProfileTutor | null>(null);

  const { participants, loading: participantsLoading } = useParticipants(token, courseId ?? null);
  const { courses } = useUserCourses(studentId, token);
  const { profile } = useProfile(studentId, token);
  const actions = useProfileActions(studentId, token, profile);

  if (!isTeacherRole(roleName)) {
    return (
      <Page>
        <Alert variant="error">No tienes permiso para ver esta página.</Alert>
      </Page>
    );
  }

  if (participantsLoading) {
    return (
      <Page>
        <span className="text-sm text-(--fg-muted)">Cargando…</span>
      </Page>
    );
  }

  const student = participants.find((p) => p.id === studentId);

  if (!student) {
    return (
      <Page>
        <EmptyState emoji="🚫" title="Alumno no encontrado" subtitle="No se encontró a este alumno en el curso indicado." />
      </Page>
    );
  }

  const studentUser: User = {
    id: student.id,
    username: '',
    firstName: student.fullName.split(' ')[0] ?? student.fullName,
    fullName: student.fullName,
    avatarUrl: student.avatarUrl ?? student.avatarUrlSmall,
    roleId: student.roleId,
    roleName: 'student',
  };

  return (
    <>
      <StudentProfileView
        user={studentUser}
        courses={courses}
        profile={profile}
        onEditFamily={() => setEditFamilyOpen(true)}
        onSelectTutor={setContactTutor}
      />

      <EditFamilyModal
        key={editFamilyOpen ? 'family-open' : 'family-closed'}
        open={editFamilyOpen}
        onClose={() => setEditFamilyOpen(false)}
        profile={profile}
        onSave={async (p) => { await actions.saveFamily(p); setEditFamilyOpen(false); }}
        saving={actions.savingProfile}
      />

      <FamilyContactModal open={!!contactTutor} tutor={contactTutor} onClose={() => setContactTutor(null)} />
    </>
  );
};

export default TeacherStudentProfilePage;
