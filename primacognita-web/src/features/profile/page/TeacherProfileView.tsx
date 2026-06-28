import type { User } from '@/modules/user/domain/User';
import type { Course } from '@/modules/course/domain/Course';
import type { Profile } from '@/modules/profile/domain/Profile';
import { ProfileHero } from '../components/ProfileHero';
import { AboutMeCard } from '../components/AboutMeCard';
import { TeacherCoursesCard } from '../components/TeacherCoursesCard';

type TeacherProfileViewProps = {
  user: User;
  courses: Course[];
  profile: Profile | null;
  onEditAccount: () => void;
  onEditAbout: () => void;
};

export function TeacherProfileView({ user, courses, profile, onEditAccount, onEditAbout }: TeacherProfileViewProps) {
  const stats = [
    {
      icon: '📚',
      label: 'Cursos activos',
      value: courses.length,
      colorClass: 'bg-emerald-50',
      textClass: 'text-emerald-800',
      borderClass: 'border-emerald-200',
      iconBg: 'bg-white',
    },
    {
      icon: '👥',
      label: 'Alumnos totales',
      value: profile?.studentCount ?? 0,
      colorClass: 'bg-sky-50',
      textClass: 'text-sky-800',
      borderClass: 'border-sky-200',
      iconBg: 'bg-white',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-(--tint-100)">
      <ProfileHero
        fullName={user.fullName}
        roleName={user.roleName}
        avatarUrl={user.avatarUrl}
        stats={stats}
        onEditAccount={onEditAccount}
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-5">
          <AboutMeCard about={profile?.about ?? { superpoder: '', cumpleanos: '', animal: '', talento: '' }} onEdit={onEditAbout} />
          <TeacherCoursesCard courses={courses} />
        </div>
        <div className="flex flex-col gap-3" />
      </div>
    </div>
  );
}
