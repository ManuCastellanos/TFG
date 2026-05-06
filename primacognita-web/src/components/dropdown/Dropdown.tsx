import { cn } from '@/shared/utils/cn';

type DropdownProps = {
  children: React.ReactNode;
  className?: string;
};

export const Dropdown = ({ children, className }: DropdownProps) => {
  return (
    <div
      className={cn(
        'absolute right-0 top-full z-10 mt-1 min-w-40 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-(--shadow-md)',
        className,
      )}
    >
      {children}
    </div>
  );
};
