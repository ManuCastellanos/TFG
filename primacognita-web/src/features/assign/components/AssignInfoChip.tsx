type Tone = 'neutral' | 'warning' | 'success';

const TONES: Record<Tone, string> = {
  neutral: 'bg-(--tint-50) text-(--fg) border-(--border)',
  warning: 'bg-orange-50 text-orange-800 border-orange-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export function AssignInfoChip({
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: string;
  label: string;
  value: string;
  tone?: Tone;
}) {
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 ${TONES[tone]}`}>
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
        <div className="text-sm font-extrabold">{value}</div>
      </div>
    </div>
  );
}
