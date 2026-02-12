import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../shared/utils/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, children, ...rest }: ButtonProps) => (
  <button
    className={cn(
      "w-full rounded-xl px-4 py-3 font-medium text-white transition-colors duration-200",
      "bg-(--color-pr) hover:bg-(--color-pr-hover)",
      "focus:outline-none focus:ring-2 focus:ring-(--color-ring-strong)",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
