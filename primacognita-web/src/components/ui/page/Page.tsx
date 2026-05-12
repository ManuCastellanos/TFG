import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type PageProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
};

export const Page = ({
  title,
  description,
  actions,
  fullWidth,
  children,
}: PageProps) => {
  return (
    <main className={cn("flex flex-1 flex-col overflow-y-auto px-8 pt-5 pb-8")}>
      <div className={cn("w-full", !fullWidth && "mx-auto max-w-screen-2xl")}>
        {(title || description || actions) && (
          <header className="flex items-start justify-between gap-4 mb-6">
            <div>
              {title && (
                <h1 className="text-3xl font-semibold text-(--fg)">
                  {title}
                </h1>
              )}

              {description && (
                <p className="mt-1 text-(--fg-muted)">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="shrink-0">
                {actions}
              </div>
            )}
          </header>
        )}

        {children}
      </div>
    </main>
  );
};
