import { Banner } from '@/components/ui/banner/Banner';
import { COLOR_META, type CourseColor } from '@/shared/theme/courseColors';

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
    <Banner variant="neutral" className={`${c.border} ${c.softBanner} mb-6`}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-(--fg-subtle)">
            {label}
          </div>

          {hasProgress ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-4xl font-black leading-none ${c.text}`}>{progress}%</span>
                {subtitle && (
                  <span className={`text-sm font-black ${c.text} opacity-70`}>· {subtitle}</span>
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
                <h2 className="mb-2 text-2xl font-black leading-tight text-(--fg)">{title}</h2>
              )}
              {subtitle && (
                <p className={`text-sm font-semibold ${c.text} opacity-80`}>{subtitle}</p>
              )}
            </>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-20 rounded-2xl bg-white/70 px-4 py-3 text-center">
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-1 text-lg font-black leading-none text-(--fg)">{stat.value}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase text-(--fg-subtle)">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Banner>
  );
};
