import { useState } from 'react';
import { useSession } from '@/shared/hooks/useSession';
import { isTeacherRole } from '@/modules/user/domain/User';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { SectionListSkeleton } from '@/components/patterns/sectionSkeleton/SectionListSkeleton';
import { StudentCard } from './components/StudentCard';
import { TeacherCard } from './components/TeacherCard';
import { TipCard } from './components/TipCard';
import type { Participant } from '@/modules/course/domain/Participant';

export type ParticipantsViewProps = {
  participants: Participant[];
  loading?: boolean;
};

export const ParticipantsView = ({ participants, loading }: ParticipantsViewProps) => {
  const { userId } = useSession();
  const [query, setQuery] = useState('');

  const teacher = participants.find((p) => isTeacherRole(p.roleName));
  const students = participants.filter((p) => !isTeacherRole(p.roleName));

  const filteredStudents = students.filter((p) => p.fullName.toLowerCase().includes(query.toLowerCase()));

  if (loading) {
    return <SectionListSkeleton />;
  }

  if (participants.length === 0) {
    return <EmptyState emoji="👥" title="Sin participantes" subtitle="No hay participantes en este curso." />;
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-(--fg)">Tus compañeros</h3>
              <p className="text-sm text-(--fg-muted)">{students.length} alumnos en esta clase</p>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-2xl border border-(--border) bg-white pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:border-emerald-400 transition"
              />
              <svg
                viewBox="0 0 24 24"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--fg-muted)"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-sm text-(--fg-muted) text-center py-8">
              {query ? 'No se encontraron compañeros.' : 'No hay compañeros en este curso.'}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredStudents.map((s) => (
                <StudentCard key={s.id} student={s} isCurrentUser={s.id === userId} />
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="flex flex-col gap-3">
        {teacher && <TeacherCard teacher={teacher} />}
        <TipCard />
      </aside>
    </div>
  );
};
