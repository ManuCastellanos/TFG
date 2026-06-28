import { useState } from 'react';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { isStudentRole } from '@/modules/user/domain/User';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useUpdateAccount } from '../hooks/useUpdateAccount';
import { useChangePassword } from '../hooks/useChangePassword';
import { StudentProfileView } from './StudentProfileView';
import { TeacherProfileView } from './TeacherProfileView';
import { EditAboutModal } from '../components/EditAboutModal';
import { EditFamilyModal } from '../components/EditFamilyModal';
import { EditAccountModal } from '../components/EditAccountModal';
import type { UpdateProfileParams, UpdateAccountParams, ChangePasswordParams } from '@/modules/profile/domain/Profile';

const ProfilePage = () => {
  const [editAboutOpen, setEditAboutOpen]     = useState(false);
  const [editFamilyOpen, setEditFamilyOpen]   = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [passwordError, setPasswordError]     = useState<string | null>(null);

  const { userId, token } = useSession();
  const { user } = useCurrentUser();
  const { courses } = useUserCourses(userId, token);
  const { profile } = useProfile(userId, token);
  const updateProfileMutation = useUpdateProfile(userId, token);
  const updateAccountMutation = useUpdateAccount(userId, token);
  const changePasswordMutation = useChangePassword(token);

  const handleSaveAbout = async (params: Pick<UpdateProfileParams, 'superpoder' | 'cumpleanos' | 'animal' | 'talento'>) => {
    await updateProfileMutation.mutateAsync(params as UpdateProfileParams);
    setEditAboutOpen(false);
  };

  const handleSaveFamily = async (params: Pick<UpdateProfileParams, 'tutor1_nombre' | 'tutor1_email' | 'tutor1_telefono' | 'tutor2_nombre' | 'tutor2_email' | 'tutor2_telefono'>) => {
    await updateProfileMutation.mutateAsync(params as UpdateProfileParams);
    setEditFamilyOpen(false);
  };

  const handleSaveAccount = async (params: UpdateAccountParams) => {
    await updateAccountMutation.mutateAsync(params);
    setEditAccountOpen(false);
  };

  const handleChangePassword = async (params: ChangePasswordParams) => {
    setPasswordError(null);
    try {
      await changePasswordMutation.mutateAsync(params);
      setEditAccountOpen(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    }
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
          onEditAccount={() => setEditAccountOpen(true)}
          onEditAbout={() => setEditAboutOpen(true)}
          onEditFamily={() => setEditFamilyOpen(true)}
        />
      ) : (
        <TeacherProfileView
          user={user}
          courses={courses}
          profile={profile}
          onEditAccount={() => setEditAccountOpen(true)}
          onEditAbout={() => setEditAboutOpen(true)}
        />
      )}

      <EditAboutModal
        key={editAboutOpen ? 'about-open' : 'about-closed'}
        open={editAboutOpen}
        onClose={() => setEditAboutOpen(false)}
        profile={profile}
        onSave={handleSaveAbout}
        saving={updateProfileMutation.isPending}
      />

      {isStudent && (
        <EditFamilyModal
          key={editFamilyOpen ? 'family-open' : 'family-closed'}
          open={editFamilyOpen}
          onClose={() => setEditFamilyOpen(false)}
          profile={profile}
          onSave={handleSaveFamily}
          saving={updateProfileMutation.isPending}
        />
      )}

      <EditAccountModal
        key={editAccountOpen ? 'account-open' : 'account-closed'}
        open={editAccountOpen}
        onClose={() => {
          setEditAccountOpen(false);
          setPasswordError(null);
        }}
        user={user}
        onSaveAccount={handleSaveAccount}
        onChangePassword={handleChangePassword}
        savingAccount={updateAccountMutation.isPending}
        savingPassword={changePasswordMutation.isPending}
        passwordError={passwordError}
      />
    </>
  );
};

export default ProfilePage;
