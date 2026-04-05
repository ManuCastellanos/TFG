import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../shared/utils/cn";
import { buttonStyles, type ButtonVariant } from "./button.styles";

export type { ButtonVariant };
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({ className, children, variant = "primary", ...rest }: ButtonProps) => (
  <button
    className={cn(buttonStyles.base, buttonStyles.variants[variant], className)}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
