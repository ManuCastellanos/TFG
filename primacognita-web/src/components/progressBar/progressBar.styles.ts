export const progressBarClasses = {
  root: "flex flex-col gap-6 border border-(--border) p-6",

  header: "flex items-center justify-between",
  labelWrapper: "flex flex-col",
  label: "text-xs font-semibold uppercase tracking-wider text-(--fg-subtle)",
  title: "mt-1 text-2xl font-extrabold text-(--fg)",

  circle:
    "flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow-sm bg-linear-to-br from-(--course-purple-from) to-(--course-violet-to)",

  barSection: "flex flex-col gap-2",
  track: "h-4 w-full overflow-hidden rounded-full bg-(--surface-muted)",
  fill: "h-full rounded-full bg-linear-to-r from-(--course-green-from) to-(--course-emerald-to) transition-all duration-500",
  scaleLabels: "flex justify-between text-xs text-(--fg-subtle)",
} as const;
