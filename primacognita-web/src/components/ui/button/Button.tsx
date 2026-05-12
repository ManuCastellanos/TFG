import { cn } from "@/shared/utils/cn";
import { buttonStyles } from "./button.styles";
import type { ButtonProps } from "./button.types";

export const Button = ({
  className, children, variant = "primary", size = "md", ref, ...rest
}: ButtonProps) => (
  <button
    ref={ref}
    className={cn(
      buttonStyles.base,
      buttonStyles.sizes[size],
      buttonStyles.variants[variant],
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

Button.displayName = "Button";
