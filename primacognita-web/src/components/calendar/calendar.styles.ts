export const calendarClasses = {
  root: "w-full rounded-3xl border border-(--border) bg-white p-5 text-(--fg)",

  header: "mb-4 flex items-center",
  headerDivider: "mx-2 h-4 w-px shrink-0 bg-(--border)",
  headerTitle: "flex-1 text-center",
  chevron: "size-5 text-(--fg-muted)",
  title: "text-sm font-extrabold text-(--fg) transition-opacity",
  titleFetching: "opacity-40",
  titleText: "opacity-100",

  dowRow: "mb-1 grid grid-cols-7 gap-1 text-center",
  dowCell: "py-1 text-[11px] font-bold text-(--fg-subtle) uppercase",

  grid: "grid grid-cols-7 gap-1 text-center",
  emptyCell: "aspect-square",
  cell: "aspect-square flex items-center justify-center",

  dayBase:
    "relative flex w-full h-full select-none items-center justify-center rounded-xl text-sm font-bold transition-colors",

  dayToday: "bg-[#274E38] text-white font-extrabold",

  dayNormal: "text-(--fg) hover:bg-(--tint-50) cursor-default",

  dayGhost: "text-(--fg-subtle) opacity-40",

  dayHasEvents:
    "cursor-pointer text-(--fg) ring-2 ring-emerald-500 hover:bg-(--tint-50)",

  dayHasOverdue:
    "cursor-pointer text-red-500 ring-2 ring-red-400 hover:bg-red-50",

  dayText: "relative z-10",
} as const;
