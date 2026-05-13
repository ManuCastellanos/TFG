const BADGES = [
  { id: 1, name: 'Principiante', description: 'Completa tu primer ejercicio', emoji: '🌱', earned: true },
  { id: 2, name: 'Matemático', description: 'Saca un 10 en un cuestionario', emoji: '🧮', earned: true },
  { id: 3, name: 'Racha', description: '5 días seguidos practicando', emoji: '🔥', earned: false },
  { id: 4, name: 'Compañero', description: 'Ayuda a un compañero', emoji: '🤝', earned: false },
  { id: 5, name: 'Explorador', description: 'Prueba todos los tipos de actividad', emoji: '🧭', earned: false },
  { id: 6, name: 'Campeón', description: 'Completa todos los ejercicios del curso', emoji: '🏆', earned: false },
];

export const BadgesSection = () => {
  const earned = BADGES.filter((b) => b.earned).length;

  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-(--fg)">Tus insignias</h3>
        <span className="text-xs font-bold text-(--fg-muted)">{earned} / {BADGES.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border-2 text-center transition ${
              b.earned
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                : 'bg-(--tint-50) border-(--border) opacity-60'
            }`}
          >
            <div
              className={`size-14 rounded-2xl mx-auto mb-2 grid place-items-center text-3xl ${
                b.earned
                  ? 'bg-gradient-to-br from-amber-200 to-orange-300 shadow-sm'
                  : 'bg-(--tint-100)'
              }`}
            >
              {b.earned ? b.emoji : '🔒'}
            </div>
            <div className="font-extrabold text-sm text-(--fg) leading-tight">{b.name}</div>
            <div className="text-[10px] font-bold text-(--fg-muted) mt-1 leading-snug">{b.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
