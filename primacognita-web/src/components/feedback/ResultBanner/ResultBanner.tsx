const CONFETTI: [string, string, string][] = [
  ['12%', '25%', '#10b981'], ['28%', '55%', '#8b5cf6'], ['42%', '15%', '#f59e0b'],
  ['56%', '40%', '#ec4899'], ['72%', '22%', '#06b6d4'], ['86%', '55%', '#10b981'],
  ['18%', '75%', '#f59e0b'], ['48%', '78%', '#8b5cf6'], ['78%', '80%', '#ec4899'],
];

type ResultLevel = {
  border: string;
  bg: string;
  textColor: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  emoji: string;
  message: string;
  showConfetti: boolean;
};

function getLevel(pct: number, effectivePassPct: number): ResultLevel {
  if (pct >= 100) {
    return {
      border: 'border-violet-200',
      bg: 'bg-gradient-to-br from-violet-50 via-white to-violet-100',
      textColor: 'text-violet-700',
      iconBg: 'from-violet-300 to-violet-600',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-800',
      emoji: '🌟',
      message: '¡Lo has bordado!',
      showConfetti: true,
    };
  }
  if (pct >= 70) {
    return {
      border: 'border-emerald-200',
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100',
      textColor: 'text-emerald-700',
      iconBg: 'from-emerald-300 to-emerald-600',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      emoji: '💪',
      message: '¡Enhorabuena!',
      showConfetti: true,
    };
  }
  if (pct >= effectivePassPct) {
    return {
      border: 'border-amber-200',
      bg: 'bg-gradient-to-br from-amber-50 via-white to-amber-100',
      textColor: 'text-amber-700',
      iconBg: 'from-amber-300 to-amber-500',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      emoji: '👍',
      message: '¡Sigue así!',
      showConfetti: true,
    };
  }
  return {
    border: 'border-rose-200',
    bg: 'bg-gradient-to-br from-rose-50 via-white to-rose-100',
    textColor: 'text-rose-700',
    iconBg: 'from-rose-300 to-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    emoji: '❌',
    message: '¡Hay que mejorar!',
    showConfetti: false,
  };
}

type Props = {
  grade: number;
  maxGrade: number;
  passGrade?: number;
  title?: string;
  feedback?: string;
};

export function ResultBanner({ grade, maxGrade, passGrade, title, feedback }: Props) {
  const pct = maxGrade > 0 ? (grade / maxGrade) * 100 : 0;
  const effectivePassPct = passGrade != null && maxGrade > 0 ? (passGrade / maxGrade) * 100 : 50;

  const level = getLevel(pct, effectivePassPct);

  const gradeDisplay = grade.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const maxDisplay = maxGrade.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 ${level.border} ${level.bg} p-7`}>
      {level.showConfetti && (
        <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {CONFETTI.map((c, i) => (
            <circle key={i} cx={c[0]} cy={c[1]} r={i % 2 ? 5 : 3.5} fill={c[2]} opacity="0.8" />
          ))}
        </svg>
      )}

      <div className="relative flex items-center gap-5">
        <div className={`size-20 rounded-3xl bg-gradient-to-br ${level.iconBg} grid place-items-center text-4xl shadow-lg shrink-0`}>
          {level.emoji}
        </div>
        <div className="flex-1">
          <div className={`text-xs font-bold uppercase tracking-wider ${level.textColor} mb-1`}>
            {level.message}
          </div>
          {title && (
            <h2 className="text-2xl font-extrabold text-(--fg) leading-tight mb-1">{title}</h2>
          )}
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-extrabold leading-none ${level.textColor}`}>
              {gradeDisplay}
            </span>
            <span className="text-xl font-bold text-(--fg-muted)">/ {maxDisplay}</span>
            <span className={`text-sm font-extrabold rounded-full px-3 py-1 ml-1 ${level.badgeBg} ${level.badgeText}`}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="relative mt-4 p-4 rounded-2xl bg-white/60 border border-white/40">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">
            Comentario del profe
          </div>
          <p className="text-sm text-(--fg)" dangerouslySetInnerHTML={{ __html: feedback }} />
        </div>
      )}
    </div>
  );
}
