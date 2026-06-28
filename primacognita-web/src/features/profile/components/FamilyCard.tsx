import type { ProfileTutor } from '@/modules/profile/domain/Profile';

type FamilyCardProps = {
  family: ProfileTutor[];
  onEdit: () => void;
};

const AVATAR_COLORS = [
  'from-rose-300 to-rose-500',
  'from-cyan-300 to-cyan-500',
];

export function FamilyCard({ family, onEdit }: FamilyCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-(--border) p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-extrabold text-(--fg)">Familia</h4>
        <button type="button" onClick={onEdit} className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800">
          Editar
        </button>
      </div>
      {family.length === 0 ? (
        <p className="text-sm text-(--fg-muted)">No hay tutores registrados.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {family.map((tutor, i) => {
            const initials = tutor.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-(--tint-50)">
                <div className={`size-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} grid place-items-center text-white font-extrabold text-xs shrink-0`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-(--fg) truncate">{tutor.nombre}</div>
                  {tutor.email && <div className="text-[10px] font-bold text-(--fg-subtle) truncate">{tutor.email}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
