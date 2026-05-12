import { Banner } from "@/components/ui/banner/Banner";
import { RichText } from "@/components/ui/rich-text";

const CONFETTI: [string, string, string][] = [
  ['12%', '25%', '#10b981'], ['28%', '55%', '#8b5cf6'], ['42%', '15%', '#f59e0b'],
  ['56%', '40%', '#ec4899'], ['72%', '22%', '#06b6d4'], ['86%', '55%', '#10b981'],
  ['18%', '75%', '#f59e0b'], ['48%', '78%', '#8b5cf6'], ['78%', '80%', '#ec4899'],
];

type ResultLevel = {
  variant: "success" | "warning" | "info";
  emoji: string;
  message: string;
  showConfetti: boolean;
};

function getLevel(pct: number, effectivePassPct: number): ResultLevel {
  if (pct >= 100) {
    return { variant: "success", emoji: "🌟", message: "¡Lo has bordado!", showConfetti: true };
  }
  if (pct >= 70) {
    return { variant: "success", emoji: "💪", message: "¡Enhorabuena!", showConfetti: true };
  }
  if (pct >= effectivePassPct) {
    return { variant: "warning", emoji: "👍", message: "¡Sigue así!", showConfetti: true };
  }
  return { variant: "info", emoji: "❌", message: "¡Hay que mejorar!", showConfetti: false };
}

type Props = {
  grade: number;
  maxGrade: number;
  passGrade?: number;
  title?: string;
  feedback?: string;
};

function ConfettiDecoration() {
  return (
    <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      {CONFETTI.map((c, i) => (
        <circle key={`${c[0]},${c[1]}`} cx={c[0]} cy={c[1]} r={i % 2 ? 5 : 3.5} fill={c[2]} opacity="0.8" />
      ))}
    </svg>
  );
}

export function ResultBanner({ grade, maxGrade, passGrade, title, feedback }: Props) {
  const pct = maxGrade > 0 ? (grade / maxGrade) * 100 : 0;
  const effectivePassPct = passGrade != null && maxGrade > 0 ? (passGrade / maxGrade) * 100 : 50;
  const level = getLevel(pct, effectivePassPct);

  const gradeDisplay = grade.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const maxDisplay = maxGrade.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  return (
    <Banner
      variant={level.variant}
      icon={level.emoji}
      title={title}
      badge={level.message}
      className="relative"
    >
      {level.showConfetti && <ConfettiDecoration />}

      <div className="flex items-baseline gap-2 mt-2">
        <span className={`text-4xl font-extrabold leading-none ${level.variant === "success" ? "text-emerald-700" : level.variant === "warning" ? "text-amber-700" : "text-blue-700"}`}>
          {gradeDisplay}
        </span>
        <span className="text-xl font-bold text-(--fg-muted)">/ {maxDisplay}</span>
        <span className={`text-sm font-extrabold rounded-full px-3 py-1 ml-1 ${level.variant === "success" ? "bg-emerald-100 text-emerald-800" : level.variant === "warning" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
          {Math.round(pct)}%
        </span>
      </div>

      {feedback && (
        <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-white/40">
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">
            Comentario del profe
          </div>
          <RichText html={feedback} className="text-sm text-(--fg)" />
        </div>
      )}
    </Banner>
  );
}
