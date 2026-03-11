export const calendarClasses = {
  root: "w-full rounded-2xl border border-(--calendar-border) bg-(--calendar-bg) p-4 text-(--fg)",

  header: "mb-3 flex items-center py-1.5",
  headerDivider: "mx-2 h-4 w-px shrink-0 bg-(--calendar-border)",
  headerTitle: "flex-1 text-center",
  chevron: "size-5 text-(--pr-600)",
  title: "text-md font-bold text-(--fg) transition-opacity",
  titleFetching: "opacity-40",
  titleText: "opacity-100",

  dowRow: "mb-1 grid grid-cols-7 text-center",
  dowCell: "py-1 text-[13px] font-bold text-gray-500",

  grid: "grid grid-cols-7 text-center",
  emptyCell: "h-8",
  cell: "flex h-8 items-center justify-center",

  dayBase:
    "relative flex size-7 select-none items-center justify-center rounded-full text-sm font-black transition-colors",

  dayToday: "bg-(--calendar-cell-selected) text-(--calendar-cell-selected-fg) font-semibold",

  dayNormal: "text-(--fg) hover:bg-(--calendar-cell-hover)",

  dayGhost: "cursor-default text-(--fg)/25",

  dayHasEvents:
    "cursor-pointer text-(--fg) ring-1 ring-(--calendar-border) ring-offset-1 ring-offset-(--calendar-bg) hover:bg-(--calendar-cell-hover)",

  dayHasOverdue:
    "cursor-pointer text-red-500 ring-1 ring-red-400 ring-offset-1 ring-offset-(--calendar-bg) hover:bg-(--calendar-cell-hover)",

  dayText: "relative z-10",
} as const;