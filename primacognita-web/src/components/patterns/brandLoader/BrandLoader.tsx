import { Sparkles } from 'lucide-react';

type BrandLoaderProps = {
  label?: string;
  sub?: string;
};

export function BrandLoader({ label = 'Cargando tu campus…', sub = 'Estamos preparando todo' }: BrandLoaderProps) {
  return (
    <div className="relative h-full w-full bg-(--tint-100) overflow-hidden grid place-items-center">
      <div className="absolute -top-20 -left-20 size-150 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-16 -right-10 size-90 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative flex flex-col items-center text-center px-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-emerald-300/40 blur-2xl pc-pulse" />
          <div className="relative size-24 rounded-3xl bg-linear-to-br from-emerald-400 to-emerald-700 grid place-items-center text-white shadow-xl pc-bounce">
            <Sparkles className="size-12" />
          </div>
        </div>

        <div className="font-extrabold text-(--fg) text-2xl mb-1">{label}</div>
        <div className="font-bold text-(--fg-muted) text-sm mb-7">{sub}</div>

        <div className="relative w-[320px] h-2 rounded-full bg-white border border-(--border) overflow-hidden">
          <div
            className="absolute top-0 bottom-0 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
            style={{ animation: 'pc-progress-indeterminate 1.6s ease-in-out infinite' }}
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          {[0, 0.15, 0.3].map((d, i) => (
            <span
              key={i}
              className="size-2.5 rounded-full bg-emerald-500"
              style={{ animation: `pc-bounce-soft 1s ease-in-out ${d}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
