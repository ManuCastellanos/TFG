import type { User } from '@/modules/user/domain/User';
import type { Course } from '@/modules/course/domain/Course';
import type { Profile } from '@/modules/profile/domain/Profile';
import { ProfileHero } from '../components/ProfileHero';
import { AboutMeCard } from '../components/AboutMeCard';
import { CoursesProgressCard } from '../components/CoursesProgressCard';
import { ActivityCard } from '../components/ActivityCard';
import { BadgesCard } from '../components/BadgesCard';
import { FamilyCard } from '../components/FamilyCard';

type StudentProfileViewProps = {
  user: User;
  courses: Course[];
  profile: Profile | null;
  onEdit: () => void;
};

export function StudentProfileView({ user, courses, profile, onEdit }: StudentProfileViewProps) {
  const stats = [
    {
      icon: '🏆',
      label: 'Insignias',
      value: profile?.badgeCount ?? 0,
      colorClass: 'bg-amber-50',
      textClass: 'text-amber-800',
      borderClass: 'border-amber-200',
      iconBg: 'bg-white',
    },
    {
      icon: '📚',
      label: 'Cursos activos',
      value: courses.length,
      colorClass: 'bg-violet-50',
      textClass: 'text-violet-800',
      borderClass: 'border-violet-200',
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
        onEdit={onEdit}
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-5">
          <AboutMeCard about={profile?.about ?? { superpoder: '', cumpleanos: '', animal: '', talento: '' }} onEdit={onEdit} />
          <CoursesProgressCard courses={courses} />
          <ActivityCard activities={profile?.recentActivity ?? []} />
        </div>
        <div className="flex flex-col gap-3">
          <BadgesCard badges={profile?.recentBadges ?? []} total={profile?.badgeCount ?? 0} />
          <FamilyCard family={profile?.family ?? []} onEdit={onEdit} />
        </div>
      </div>
    </div>
  );
}
