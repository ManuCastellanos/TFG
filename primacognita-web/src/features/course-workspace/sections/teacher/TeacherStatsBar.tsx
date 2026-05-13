type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  softClass: string;
  textClass: string;
};

const StatCard = ({ icon, label, value, sub, softClass, textClass }: StatCardProps) => (
  <div className="bg-white rounded-2xl border border-(--border) p-4">
    <div className="flex items-center gap-3">
      <div className={`size-11 rounded-xl ${softClass} ${textClass} grid place-items-center text-xl shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-(--fg-subtle) font-bold uppercase tracking-wider">{label}</div>
        <div className="text-xl font-extrabold text-(--fg) leading-tight">{value}</div>
        {sub && <div className="text-xs text-(--fg-muted) mt-0.5">{sub}</div>}
      </div>
    </div>
  </div>
);

type TeacherStatsBarProps = {
  studentsCount: number;
  activeCount: number;
  avgProgress: number;
  pendingTotal: number;
};

export function TeacherStatsBar({ studentsCount, activeCount, avgProgress, pendingTotal }: TeacherStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard
        icon="👥"
        label="Alumnos"
        value={studentsCount}
        sub={`${activeCount} activos esta semana`}
        softClass="bg-sky-100"
        textClass="text-sky-700"
      />
      <StatCard
        icon="📈"
        label="Avance medio"
        value={`${avgProgress}%`}
        sub="del trimestre"
        softClass="bg-emerald-100"
        textClass="text-emerald-700"
      />
      <StatCard
        icon="📝"
        label="Por revisar"
        value={pendingTotal}
        sub="entregas pendientes"
        softClass="bg-orange-100"
        textClass="text-orange-700"
      />
    </div>
  );
}
