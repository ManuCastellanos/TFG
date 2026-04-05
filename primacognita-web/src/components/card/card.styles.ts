export const cardStyles = {
  base: "rounded-2xl bg-(--surface) p-8 transition-colors",
  variants: {
    default: "w-full",
    auth: "w-full max-w-md",
  },
} as const;

export type CardVariant = keyof typeof cardStyles.variants;
