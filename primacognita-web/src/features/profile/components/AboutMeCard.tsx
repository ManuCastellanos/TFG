import type { ProfileAbout } from '@/modules/profile/domain/Profile';

type AboutMeCardProps = {
  about: ProfileAbout;
  onEdit: () => void;
};

const FIELDS: { key: keyof ProfileAbout; label: string; emoji: string }[] = [
  { key: 'superpoder', label: 'Mi superpoder',         emoji: '🚀' },
  { key: 'cumpleanos', label: 'Cumpleaños',            emoji: '🎂' },
  { key: 'animal',     label: 'Animal favorito',       emoji: '🦊' },
  { key: 'talento',    label: 'Lo que mejor se me da', emoji: '✏️' },
];

export function AboutMeCard({ about, onEdit }: AboutMeCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-(--fg)">Sobre mí</h3>
        <button type="button" onClick={onEdit} className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800">
          Editar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, emoji }) => (
          <div key={key}>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-1">{label}</div>
            <div className="font-extrabold text-(--fg)">
              {about[key] ? `${emoji} ${about[key]}` : <span className="text-(--fg-subtle) font-normal text-sm">Sin rellenar</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
