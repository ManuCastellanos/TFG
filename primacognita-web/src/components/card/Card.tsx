import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        `
        w-full
        rounded-2xl
        bg-(--surface)
        p-8
        transition-colors
        `,
        className
      )}
      {...props}
    />
  );
};