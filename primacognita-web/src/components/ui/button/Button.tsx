import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";
import { buttonStyles, type ButtonVariant, type ButtonSize } from "./button.styles";

export type { ButtonVariant, ButtonSize };
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = ({ className, children, variant = "primary", size = "md", ...rest }: ButtonProps) => (
  <button
    className={cn(buttonStyles.base, buttonStyles.sizes[size], buttonStyles.variants[variant], className)}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
