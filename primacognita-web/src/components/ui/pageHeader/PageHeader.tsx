import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  emoji?: string;
  emojiClass?: string;
  onBack?: () => void;
  backLabel?: string;
  end?: ReactNode;
};

export function PageHeader({ title, subtitle, emoji, emojiClass, onBack, backLabel = 'Volver', end }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 min-w-0">
      {onBack && (
        <Button variant="outline" size="icon" type="button" onClick={onBack} aria-label={backLabel}>
          <ArrowLeft className="size-5" />
        </Button>
      )}
      {emoji && (
        <div className={`size-14 shrink-0 rounded-2xl ${emojiClass} grid place-items-center text-2xl`}>{emoji}</div>
      )}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex flex-col min-w-0">
          {subtitle && (
            <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">{subtitle}</span>
          )}
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">{title}</h1>
        </div>
        {end}
      </div>
    </div>
  );
}
