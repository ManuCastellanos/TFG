import { useState } from 'react';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { isStudentRole } from '@/modules/user/domain/User';
import { useProfile } from '../hooks/useProfile';
import { useProfileActions } from '../hooks/useProfileActions';
import { StudentProfileView } from './StudentProfileView';
import { TeacherProfileView } from './TeacherProfileView';
import { EditAboutModal } from '../components/EditAboutModal';
import { EditFamilyModal } from '../components/EditFamilyModal';
import { EditAccountModal } from '../components/EditAccountModal';

const ProfilePage = () => {
  const [editAboutOpen, setEditAboutOpen]     = useState(false);
  const [editFamilyOpen, setEditFamilyOpen]   = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);

  const { userId, token } = useSession();
  const { user } = useCurrentUser();
  const { courses } = useUserCourses(userId, token);
  const { profile } = useProfile(userId, token);
  const actions = useProfileActions(userId, token);

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
        onSave={async (p) => { await actions.saveAbout(p); setEditAboutOpen(false); }}
        saving={actions.savingProfile}
      />

      {isStudent && (
        <EditFamilyModal
          key={editFamilyOpen ? 'family-open' : 'family-closed'}
          open={editFamilyOpen}
          onClose={() => setEditFamilyOpen(false)}
          profile={profile}
          onSave={async (p) => { await actions.saveFamily(p); setEditFamilyOpen(false); }}
          saving={actions.savingProfile}
        />
      )}

      <EditAccountModal
        key={editAccountOpen ? 'account-open' : 'account-closed'}
        open={editAccountOpen}
        onClose={() => { setEditAccountOpen(false); actions.clearPasswordError(); }}
        user={user}
        onSaveAccount={async (p) => { await actions.saveAccount(p); setEditAccountOpen(false); }}
        onChangePassword={async (p) => { const ok = await actions.changePassword(p); if (ok) setEditAccountOpen(false); }}
        savingAccount={actions.savingAccount}
        savingPassword={actions.savingPassword}
        passwordError={actions.passwordError}
      />
    </>
  );
};

export default ProfilePage;
