export const calendarClasses = {
  root: "w-full p-4 text-(--fg)",

  header: "flex items-center justify-between mb-3",
  chevron: "size-4 text-(--color-pr)",
  title: "text-sm font-semibold text-(--fg) transition-opacity",
  titleFetching: "opacity-40",
  titleText: "opacity-100",

  dowRow: "grid grid-cols-7 text-center mb-1",
  dowCell: "py-1 text-[11px] font-medium text-(--fg-muted)",

  grid: "grid grid-cols-7 text-center",
  emptyCell: "h-8",
  cell: "flex h-8 items-center justify-center",

  dayBase:
    "relative flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors select-none",

  dayToday: "bg-(--fg) text-(--bg) font-semibold",

  dayNormal: "text-(--fg) hover:bg-(--fg)/8",

  dayHasEvents:
    "cursor-pointer ring-1 ring-(--fg)/30 ring-offset-1 ring-offset-(--surface)",

  dayHasOverdue:
    "cursor-pointer ring-1 ring-red-400 ring-offset-1 ring-offset-(--surface) text-red-500",

  weekendBlur1:
    "pointer-events-none absolute inset-0 rounded-full bg-(--fg)/5",
  weekendBlur2: "",

  dayText: "relative z-10",
} as const;