import { cn } from "@/shared/utils/cn";

export type LoadingStateProps = {
  emoji?: string;
  label?: string;
  className?: string;
};

export function LoadingState({ emoji = "⏳", label = "Cargando…", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center py-16", className)}>
      <div className="text-center">
        <div className="text-3xl mb-3">{emoji}</div>
        <p className="text-sm text-(--fg-muted) font-bold">{label}</p>
      </div>
    </div>
  );
}
