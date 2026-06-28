type StatChip = {
  icon: string;
  label: string;
  value: string | number;
  colorClass: string;
  textClass: string;
  borderClass: string;
  iconBg: string;
};

type ProfileHeroProps = {
  fullName: string;
  roleName: string | null;
  avatarUrl: string | null;
  stats: StatChip[];
  onEdit: () => void;
};

export function ProfileHero({ fullName, roleName, avatarUrl, stats, onEdit }: ProfileHeroProps) {
  const initials = fullName.trim().slice(0, 1).toUpperCase();
  const roleLabel = roleName === 'student' ? 'alumno' : roleName === 'editingteacher' || roleName === 'teacher' ? 'profesor/a' : roleName ?? '';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-6 bg-white border border-(--border)">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-emerald-300 via-sky-300 to-violet-300 relative">
        <svg viewBox="0 0 800 160" className="absolute inset-0 w-full h-full" aria-hidden>
          {[...Array(20)].map((_, i) => (
            <circle key={i} cx={`${(i * 37) % 100}%`} cy={`${(i * 23) % 100}%`} r={2 + (i % 3)} fill="white" opacity="0.4" />
          ))}
        </svg>
      </div>

      <div className="px-8 pb-6 -mt-12 relative">
        <div className="flex items-end gap-5 mb-4">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="size-28 rounded-3xl border-4 border-white shadow-lg object-cover" />
            ) : (
              <div className="size-28 rounded-3xl bg-gradient-to-br from-sky-300 to-sky-500 grid place-items-center text-white font-extrabold text-5xl border-4 border-white shadow-lg">
                {initials}
              </div>
            )}
          </div>

          {/* Name + role */}
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-extrabold text-(--fg) leading-tight">{fullName}</h1>
            <div className="flex items-center gap-3 text-sm text-(--fg-muted) mt-1">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" />
                En línea
              </span>
              <span>·</span>
              <span className="font-bold capitalize">{roleLabel}</span>
              <span>·</span>
              <span>Centro Prima Cognita</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110"
          >
            ✏️ Editar perfil
          </button>
        </div>

        {/* Stats strip */}
        {stats.length > 0 && (
          <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
            {stats.map((s) => (
              <div key={s.label} className={`rounded-2xl ${s.colorClass} border ${s.borderClass} p-3 flex items-center gap-3`}>
                <div className={`size-10 rounded-xl ${s.iconBg} grid place-items-center text-xl`}>{s.icon}</div>
                <div>
                  <div className={`text-xl font-extrabold ${s.textClass} leading-none`}>{s.value}</div>
                  <div className={`text-[10px] font-bold uppercase ${s.textClass} opacity-80 mt-0.5`}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
