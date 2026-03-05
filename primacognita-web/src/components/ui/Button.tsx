import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../shared/utils/cn";

export type ButtonVariant = "primary" | "ghost";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({ className, children, variant = "primary", ...rest }: ButtonProps) => (
  <button
    className={cn(
      "rounded-xl font-medium transition-colors duration-200",
      "focus:outline-none",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      variant === "primary" && [
        "w-full px-4 py-3 text-white",
        "bg-(--color-pr) hover:bg-(--color-pr-hover)",
        "focus:ring-2 focus:ring-(--color-ring-strong)",
      ],
      variant === "ghost" && [
        "w-auto p-2",
        "bg-transparent text-(--color-pr)",
        "hover:bg-(--bg)",
      ],
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;