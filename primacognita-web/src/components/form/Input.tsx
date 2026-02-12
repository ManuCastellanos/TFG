import type { ReactNode, InputHTMLAttributes } from "react";
import { cn } from "../../shared/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightAdornment?: ReactNode;
};

export const Input = ({
  rightAdornment,
  placeholder,
  className,
  ...rest
}: InputProps) => {
  return (
    <div className="relative">
      <input
        {...rest}
        placeholder=" "
        className={cn(
          `
          peer w-full rounded-xl border
          bg-(--surface) text-(--fg)
          border-(--border)
          px-4 pt-7 pb-3 outline-none
          focus:border-(--color-pr)
          focus:ring-2 focus:ring-(--color-ring)
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-colors duration-200
          `,
          rightAdornment ? "pr-12" : "",
          className
        )}
      />

      <label
        className={`
          absolute left-4 top-2 text-sm transition-all duration-200
          text-[--muted-2]
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
          peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-sm
          peer-focus:text-[--color-pr]
        `}
      >
        {placeholder}
      </label>

      {rightAdornment && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightAdornment}
        </div>
      )}
    </div>
  );
};
