type SummaryCardProps = {
  graded: number;
  total: number;
  pending: number;
  submitted: number;
};

export const SummaryCard = ({ graded, total, pending, submitted }: SummaryCardProps) => {
  const pct = total > 0 ? Math.round((graded / total) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-2">
        Resumen
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-extrabold text-(--fg)">{graded}</span>
        <span className="text-sm font-bold text-(--fg-muted)">de {total} hechos</span>
      </div>

      <div className="h-2 rounded-full bg-(--tint-100) overflow-hidden mb-4">
        <div
          className="h-full bg-linear-to-r from-emerald-300 to-emerald-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-orange-50 p-2.5">
          <div className="text-lg font-extrabold text-orange-700">{pending}</div>
          <div className="text-[10px] font-bold uppercase text-orange-700/80">Por hacer</div>
        </div>
        <div className="rounded-xl bg-sky-50 p-2.5">
          <div className="text-lg font-extrabold text-sky-700">{submitted}</div>
          <div className="text-[10px] font-bold uppercase text-sky-700/80">Entregados</div>
        </div>
      </div>
    </div>
  );
};
