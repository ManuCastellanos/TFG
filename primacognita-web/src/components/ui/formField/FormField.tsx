import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type FormFieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, hint, required, error, children, className }: FormFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle)">
        {label}
        {required && <span className="text-orange-600 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-(--fg-muted)">{hint}</span>}
      {error && <span className="text-sm text-red-500 mt-0.5">{error}</span>}
    </label>
  );
}
