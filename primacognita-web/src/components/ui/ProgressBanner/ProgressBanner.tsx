import { COLOR_META, type CourseColor } from '@/shared/hooks/useCourseCustomization';

type Stat = { icon: string; value: string; label: string };

export type ProgressBannerProps = {
  color?: CourseColor;
  label: string;
  title?: string;
  progress?: number;
  subtitle?: string;
  stats?: Stat[];
};

export const ProgressBanner = ({
  color = 'emerald',
  label,
  title,
  progress,
  subtitle,
  stats,
}: ProgressBannerProps) => {
  const c = COLOR_META[color];
  const hasProgress = progress != null;

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.softBanner} p-6 mb-6`}>
      <div className={`absolute top-0 -right-8 size-48 rounded-full opacity-30 blur-2xl ${c.glow}`} />

      <div className="relative grid grid-cols-[1fr_auto] items-center gap-6">
        <div>
          <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle)">
            {label}
          </div>

          {hasProgress ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-4xl font-extrabold leading-none ${c.text}`}>{progress}%</span>
                {subtitle && (
                  <span className={`text-sm font-extrabold ${c.text} opacity-70`}>· {subtitle}</span>
                )}
              </div>
              <div className="h-3 rounded-full bg-white/60">
                <div
                  className={`h-full rounded-full bg-linear-to-r ${c.grad} transition-all`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              {title && (
                <h2 className="mb-2 text-2xl font-semibold leading-tight text-(--fg)">{title}</h2>
              )}
              {subtitle && (
                <p className={`text-sm font-bold ${c.text} opacity-80`}>{subtitle}</p>
              )}
            </>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-20 rounded-2xl bg-white/70 px-4 py-3 text-center">
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-1 text-lg font-extrabold leading-none text-(--fg)">{stat.value}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase text-(--fg-subtle)">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
