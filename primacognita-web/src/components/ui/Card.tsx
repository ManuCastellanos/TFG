import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        `
        w-full max-w-md
        rounded-2xl
        bg-(--surface)
        border border-(--border)
        shadow-2xl
        p-8
        transition-colors
        `,
        className
      )}
      {...props}
    />
  );
};
