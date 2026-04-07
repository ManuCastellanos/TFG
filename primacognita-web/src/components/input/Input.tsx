import type { ReactNode, InputHTMLAttributes } from "react";
import { cn } from "../../shared/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightAdornment?: ReactNode;
};

export const Input = ({
  rightAdornment,
  placeholder,
  className,
  required,
  ...rest
}: InputProps) => {
  return (
    <div className="relative">
      <input
        {...rest}
        required={required}
        placeholder=" "
        className={cn(
          `
          peer w-full rounded-xl border
          bg-(--surface) text-(--fg)
          border-(--border)
          px-4 pt-7 pb-3 outline-none
          focus:border-(--color-pr)
          focus:ring-2 focus:ring-(--color-ring)
          transition-colors duration-200
          `,
          rightAdornment ? "pr-12" : "",
          className
        )}
      />

      <label
        className="
          pointer-events-none
          absolute left-4 top-1/2 -translate-y-1/2 text-base transition-all duration-200
          text-gray-500

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
