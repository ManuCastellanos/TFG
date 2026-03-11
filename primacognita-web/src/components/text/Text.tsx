import { cn } from "../../shared/utils/cn";
import type { HTMLAttributes } from "react";

export type TextProps = HTMLAttributes<HTMLParagraphElement>;

export const Text = ({ className, ...props }: TextProps) => {
  return (
    <p
      className={cn(
        "text-sm text-[--fg]",
        className
      )}
      {...props}
    />
  );
};
