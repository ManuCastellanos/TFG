import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

import type { Course } from '@/modules/course/domain/Course';
import type { User } from '@/modules/user/domain/User';

import { CalendarWidget } from '@/features/calendar/CalendarWidget';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/components/RecentlyAccessedPanel';
import { ProgressBanner } from '@/components/ui/ProgressBanner/ProgressBanner';
import { Page } from '@/components/ui/page/Page';

import DashCourseCard from '../components/DashCourseCard';

type DashboardViewProps = {
  user: User | null;
  courses: Course[];
  onNavigateToCourses: () => void;
  onCourseClick: (courseId: string) => void;
};

const DashboardView = ({ user, courses, onNavigateToCourses, onCourseClick }: DashboardViewProps) => {
  return (
    <Page>
      <ProgressBanner
        label={`¡Hola, ${user?.firstName ?? 'estudiante'}!`}
        title="¿Qué aprendemos hoy?"
        subtitle={`${courses.length} ${courses.length === 1 ? 'curso activo' : 'cursos activos'}`}
        stats={[
          { icon: '🏅', value: '—', label: 'Insignias' },
          { icon: '📈', value: '—', label: 'Puesto' },
        ]}
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black ">Mis cursos</h2>

            <Button
              variant="success"
              size="sm"
              type="button"
              onClick={onNavigateToCourses}
              className="flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {courses.length === 0 ? (
            <p className="text-sm text-(--fg-subtle)">No tienes cursos activos.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {courses.map((course, index) => (
                <DashCourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onClick={() => onCourseClick(course.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CalendarWidget />

          <RecentlyAccessedPanel />
        </div>
      </div>
    </Page>
  );
};

export default DashboardView;
