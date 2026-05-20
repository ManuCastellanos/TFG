import type { ReactNode } from 'react';

type Color = 'emerald' | 'orange' | 'violet' | 'sky' | 'purple' | 'amber' | 'rose' | 'blue';

const colorMap: Record<Color, { header: string; title: string }> = {
  emerald: { header: 'bg-emerald-50', title: 'text-emerald-700' },
  orange:  { header: 'bg-orange-50',  title: 'text-orange-600'  },
  violet:  { header: 'bg-violet-50',  title: 'text-violet-700'  },
  sky:     { header: 'bg-sky-50',     title: 'text-sky-700'     },
  purple:  { header: 'bg-purple-50',  title: 'text-purple-700'  },
  amber:   { header: 'bg-amber-50',   title: 'text-amber-700'   },
  rose:    { header: 'bg-rose-50',    title: 'text-rose-700'    },
  blue:    { header: 'bg-blue-50',    title: 'text-blue-700'    },
};

type Props = {
  icon: string;
  color: Color;
  title: string;
  children: ReactNode;
};

export function FormSection({ icon, color, title, children }: Props) {
  const { header, title: titleColor } = colorMap[color];
  return (
    <div className="rounded-3xl border border-(--border) bg-white">
      <div className={`${header} rounded-t-3xl px-5 py-3.5 flex items-center gap-2.5`}>
        <span className="text-xl leading-none">{icon}</span>
        <h2 className={`${titleColor} font-extrabold text-base`}>{title}</h2>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
