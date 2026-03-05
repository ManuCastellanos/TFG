export const calendarClasses = {
  root: "w-65 rounded-xl border border-(--border) bg-(--surface) p-4 text-(--fg)",
  header: "flex items-center justify-between gap-2",
  chevron: "size-5 text-(--color-pr)",

  title: "min-w-0 flex-1 text-center text-sm font-semibold",
  titleText: "truncate",
  titleFetching: "truncate opacity-70",

  dowRow: "mt-3 grid grid-cols-7 text-center text-[11px] font-semibold text-(--muted)",
  dowCell: "py-1",

  grid: "mt-1 grid grid-cols-7 gap-y-1 text-center",
  emptyCell: "h-8",

  cell: "flex h-8 items-center justify-center",
  dayBase: "relative flex size-7 items-center justify-center rounded-full text-xs transition",
  dayToday: "bg-(--color-pr) text-white",
  dayNormal: "text-(--fg) hover:bg-(--bg)",
  dayHasEvents: "ring-2 ring-(--color-scd) hover:ring-3",
  dayHasOverdue: "ring-2 ring-red-400",
  
  weekendBlur1: "pointer-events-none absolute inset-0 rounded-full bg-red-500/20 blur-[2px]",
  weekendBlur2: "pointer-events-none absolute inset-0 rounded-full bg-red-500/10",
  dayText: "relative",
} as const;