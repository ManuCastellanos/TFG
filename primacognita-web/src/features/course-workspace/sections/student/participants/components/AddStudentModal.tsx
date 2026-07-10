import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { useSearchStudents } from '../hooks/useSearchStudents';
import { useEnrollStudent } from '../hooks/useEnrollStudent';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { CourseId } from '@/modules/course/domain/Course';

type AddStudentModalProps = {
  open: boolean;
  onClose: () => void;
  courseId: CourseId;
  existingParticipantIds: Set<string>;
};

export function AddStudentModal({ open, onClose, courseId, existingParticipantIds }: AddStudentModalProps) {
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { data: results } = useSearchStudents(search);
  const enrollStudent = useEnrollStudent(courseId);

  const filteredResults = (results ?? []).filter(
    (u) => !existingParticipantIds.has(String(u.id)) && !addedIds.has(String(u.id)),
  );

  return (
    <Modal open={open} onClose={onClose} width="sm">
      <Modal.Header title="Añadir alumno" subtitle="Busca y matricula a un nuevo alumno" onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full rounded-2xl border border-(--border) bg-white pl-4 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition"
        />

        {search.length < 2 ? (
          <p className="text-sm text-(--fg-muted) text-center py-8">Escribe al menos 2 caracteres para buscar</p>
        ) : filteredResults.length === 0 ? (
          <p className="text-sm text-(--fg-muted) text-center py-8">Sin resultados</p>
        ) : (
          filteredResults.map((user) => {
            const colorIdx = user.id % SECTION_COLORS.length;
            const color = SECTION_COLORS[colorIdx];
            const justAdded = addedIds.has(String(user.id));
            return (
              <div key={user.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-(--tint-50) transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="size-10 rounded-2xl object-cover" />
                    ) : (
                      <div className={`size-10 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold text-sm`}>
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-(--fg) truncate">{user.fullName}</div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={justAdded || enrollStudent.isPending}
                  onClick={() =>
                    enrollStudent.mutate(String(user.id), {
                      onSuccess: () => setAddedIds((prev) => new Set(prev).add(String(user.id))),
                    })
                  }
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-[#274E38] text-white text-xs font-extrabold hover:brightness-110 disabled:opacity-60"
                >
                  {justAdded ? 'Añadido ✓' : enrollStudent.isPending ? 'Añadiendo…' : 'Añadir'}
                </button>
              </div>
            );
          })
        )}

        {enrollStudent.error && (
          <p className="text-sm text-red-500">
            {enrollStudent.error instanceof Error ? enrollStudent.error.message : 'No se pudo matricular al alumno'}
          </p>
        )}
      </div>
    </Modal>
  );
}
