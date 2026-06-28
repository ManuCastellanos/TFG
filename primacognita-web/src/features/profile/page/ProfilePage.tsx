import { useState } from 'react';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { isStudentRole } from '@/modules/user/domain/User';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { StudentProfileView } from './StudentProfileView';
import { TeacherProfileView } from './TeacherProfileView';
import { EditProfileModal } from '../components/EditProfileModal';
import type { UpdateProfileParams } from '@/modules/profile/domain/Profile';

const ProfilePage = () => {
  const [editOpen, setEditOpen] = useState(false);

  const { userId, token } = useSession();
  const { user } = useCurrentUser();
  const { courses } = useUserCourses(userId, token);
  const { profile } = useProfile(userId, token);
  const updateMutation = useUpdateProfile(userId, token);

  const handleSave = async (params: UpdateProfileParams) => {
    await updateMutation.mutateAsync(params);
    setEditOpen(false);
  };

  if (!user) return null;

  const isStudent = isStudentRole(user.roleName);

  return (
    <>
      {isStudent ? (
        <StudentProfileView
          user={user}
          courses={courses}
          profile={profile}
          onEdit={() => setEditOpen(true)}
        />
      ) : (
        <TeacherProfileView
          user={user}
          courses={courses}
          profile={profile}
          onEdit={() => setEditOpen(true)}
        />
      )}

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        isStudent={isStudent}
        onSave={handleSave}
        saving={updateMutation.isPending}
      />
    </>
  );
};

export default ProfilePage;
