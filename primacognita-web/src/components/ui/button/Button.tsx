import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";
import { buttonStyles } from "./button.styles";
import type { ButtonProps } from "./button.types";

export type { ButtonProps, ButtonVariant, ButtonSize } from "./button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", ...rest }, ref) => {
    return (
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
  },
);

Button.displayName = "Button";
