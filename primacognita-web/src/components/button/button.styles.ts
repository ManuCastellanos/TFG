 export const buttonStyles = {
  base: [
    "rounded-xl font-medium transition-colors duration-200",
    "focus:outline-none",
    "disabled:opacity-60 disabled:cursor-not-allowed",
  ],
  variants: {
    primary: [
      "w-full px-4 py-3",
      "bg-(--primary) text-(--primary-foreground)",
      "hover:bg-(--primary-hover)",
      "focus:ring-2 focus:ring-(--ring-strong)",
    ],
    outline: [
      "w-full px-4 py-3",
      "border border-(--border) bg-transparent text-(--fg)",
      "hover:border-(--border-strong) hover:bg-(--surface-muted)",
      "focus:ring-2 focus:ring-(--ring)",
    ],
    ghost: [
      "w-auto p-2",
      "bg-transparent text-(--fg-muted)",
      "hover:text-(--fg)",
    ],
  },
} as const;

export type ButtonVariant = keyof typeof buttonStyles.variants;
