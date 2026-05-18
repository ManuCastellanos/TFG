import type { ReactNode, InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export type InputVariant = "default" | "search";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightAdornment?: ReactNode;
  variant?: InputVariant;
};

export const Input = ({
  rightAdornment,
  placeholder,
  className,
  required,
  variant = "default",
  ...rest
}: InputProps) => {
  if (variant === "search") {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--fg-muted) pointer-events-none" />
        <input
          {...rest}
          required={required}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl border border-(--border) bg-white pl-9 pr-4 py-2.5 text-sm",
            "text-(--fg) placeholder:text-(--fg-subtle)",
            "focus:outline-none focus:border-emerald-400",
            className,
          )}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        {...rest}
        required={required}
        placeholder=" "
        className={cn(
          `peer w-full rounded-xl border
          bg-(--surface) text-(--fg)
          border-(--border)
          px-4 pt-7 pb-3 outline-none
          focus:border-(--color-pr)
          focus:ring-2 focus:ring-(--color-ring)
          transition-colors duration-200`,
          rightAdornment ? "pr-12" : "",
          className,
        )}
      />

      <label
        className="
          pointer-events-none
          absolute left-4 top-1/2 -translate-y-1/2 text-base transition-all duration-200
          text-(--fg-subtle)

          peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-(--color-pr)

          peer-[:not(:placeholder-shown)]:top-2
          peer-[:not(:placeholder-shown)]:translate-y-0
          peer-[:not(:placeholder-shown)]:text-sm
          peer-[:not(:placeholder-shown)]:text-pr-hover
        "
      >
        {placeholder}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {rightAdornment && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightAdornment}
        </div>
      )}
    </div>
  );
};
