type NextDueCardProps = {
  title: string;
  daysLabel: string;
};

export const NextDueCard = ({ title, daysLabel }: NextDueCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <h4 className="font-extrabold text-(--fg) mb-2 text-sm">Próximo cierre</h4>
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-rose-100 text-rose-700 grid place-items-center text-xl">
          ⏰
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-sm text-(--fg) truncate">{title}</div>
          <div className="text-xs text-(--fg-muted)">{daysLabel}</div>
        </div>
      </div>
    </div>
  );
};
