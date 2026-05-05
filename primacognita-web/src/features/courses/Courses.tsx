import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { Text } from '@/components/text/Text';
import { CoursesList } from './CoursesList';
import { useSession } from '@/shared/hooks/useSession';
import { useCurrentUser } from '../dashboard/hooks/useUser';
import { useUserCourses } from './hooks/useUserCourses';
import { isTeacherRole } from '@/modules/user/domain/User';

export default function Courses() {
  const navigate = useNavigate();
  const { token, userId } = useSession();
  const { user } = useCurrentUser();
  const { courses, loading, error } = useUserCourses(userId, token);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <Text className="text-2xl font-bold text-(--fg)">Mis Cursos</Text>

          {isTeacherRole(user?.roleName) && (
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="ghost"
                className="p-2"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Opciones de curso"
              >
                <Plus className="size-5" />
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-40 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-(--shadow-md)">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate({ to: '/courses/new' });
                    }}
                  >
                    Crear curso
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate({ to: '/courses/manage' });
                    }}
                  >
                    Gestionar cursos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && <Banner variant="error">{error}</Banner>}

        {loading && <Text className="text-(--muted)">Cargando cursos...</Text>}

        {!loading && !error && (
          <CoursesList
            courses={courses}
            onCourseClick={(id) => navigate({ to: '/courses/$id', params: { id } })}
            showHeader={false}
          />
        )}
    </main>
  );
}
