import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../shared/utils/cn";

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  as?: ElementType;
};

export const Surface = ({
  children,
  className,
  as: Tag = "div",
  ...props
}: SurfaceProps) => {
  return (
    <Tag
      className={cn(
        "rounded-2xl bg-[--surface] shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};