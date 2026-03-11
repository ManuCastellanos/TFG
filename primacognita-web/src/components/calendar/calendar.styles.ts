export const calendarClasses = {
  root: "w-full p-4 text-(--fg) bg-white rounded-2xl",

  header: "flex items-center mb-3",
  headerDivider: "w-px h-4 bg-(--border) mx-2 shrink-0",
  headerTitle: "flex-1 text-center",
  chevron: "size-4 text-(--color-pr)",
  title: "text-sm font-semibold text-(--fg) transition-opacity",
  titleFetching: "opacity-40",
  titleText: "opacity-100",

  dowRow: "grid grid-cols-7 text-center mb-1",
  dowCell: "py-1 text-[11px] font-semibold text-(--fg)",

  grid: "grid grid-cols-7 text-center",
  emptyCell: "h-8",
  cell: "flex h-8 items-center justify-center",

  dayBase:
    "relative flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors select-none",

  dayToday: "bg-(--pr-700) text-white font-semibold",

  dayNormal: "text-(--fg) hover:bg-(--fg)/8",

  dayWeekend: "text-red-400/80",
  dayWeekendBg: "pointer-events-none absolute inset-0 rounded-full bg-red-400/10",

  dayGhost: "text-(--fg)/25 cursor-default",

  dayHasEvents:
    "cursor-pointer ring-1 ring-blue-400/70 ring-offset-1 ring-offset-white text-(--fg)",

  dayHasOverdue:
    "cursor-pointer ring-1 ring-red-400 ring-offset-1 ring-offset-white text-red-500",

  dayText: "relative z-10",
} as const;