type Props = {
  bins: number[];
};

const BIN_COLORS = ['bg-rose-300', 'bg-amber-300', 'bg-amber-200', 'bg-sky-300', 'bg-emerald-400'];
const BIN_LABELS = ['0-2', '2-4', '4-6', '6-8', '8-10'];

export function DistributionChart({ bins }: Props) {
  const maxBin = Math.max(...bins, 0);

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5 items-end h-28 mb-2">
        {bins.map((n, i) => {
          const h = maxBin > 0 ? (n / maxBin) * 100 : 0;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full">
              <span className="text-[11px] font-extrabold text-(--fg)">{n}</span>
              <div
                className={`w-full ${BIN_COLORS[i]} rounded-t-lg`}
                style={{ height: `${h}%`, minHeight: n > 0 ? '6px' : '0' }}
              />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-extrabold text-(--fg-subtle) uppercase">
        {BIN_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
