export const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  sizes: {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  },
  variants: {
    primary: "bg-[#274E38] text-white hover:brightness-110",
    outline: "border border-(--border) bg-white text-(--fg-muted) hover:bg-(--tint-50)",
    tinted:  "bg-(--tint-50) border border-(--border) text-(--fg) hover:bg-(--tint-100)",
    ghost:   "bg-transparent text-(--fg-muted) hover:text-(--fg)",
    danger:  "bg-rose-500 text-white hover:bg-rose-600",
  },
} as const;

export type ButtonVariant = keyof typeof buttonStyles.variants;
export type ButtonSize = keyof typeof buttonStyles.sizes;
