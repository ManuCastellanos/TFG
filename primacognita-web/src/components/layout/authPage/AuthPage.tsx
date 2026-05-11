import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type AuthPageProps = HTMLAttributes<HTMLDivElement>;

export const AuthPage = ({ className, ...props }: AuthPageProps) => {
  return (
    <div
      className={cn(
        `
        min-h-screen
        bg-(--bg)
        text-(--fg)
        flex items-center justify-center
        px-4 py-10
        transition-colors
        `,
        className
      )}
      {...props}
    />
  );
};
