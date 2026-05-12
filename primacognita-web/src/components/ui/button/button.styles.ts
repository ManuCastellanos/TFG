export const buttonStyles = {
  base: [
    'inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition',
    'focus:outline-none',
    'focus-visible:ring-2 focus-visible:ring-(--ring-strong)',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  sizes: {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
    icon: 'size-10 p-0 rounded-xl',
  },
  variants: {
    primary: 'bg-[#274E38] text-white hover:brightness-110',
    outline: 'border border-(--border) bg-white text-(--fg-muted) hover:bg-(--tint-50)',
    tinted: 'bg-(--tint-50) border border-(--border) text-(--fg) hover:bg-(--tint-100)',
    ghost: 'bg-transparent text-(--fg-muted) hover:text-(--fg)',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    success: 'text-emerald-700 hover:text-emerald-800 font-bold',
    successSolid: 'bg-emerald-600 text-white hover:brightness-110',
  },
} as const;


