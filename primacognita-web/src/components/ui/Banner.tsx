import { cn } from "../../shared/utils/cn";
import type { HTMLAttributes } from "react";

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "error" | "success" | "warning" | "info";
};

export const Banner = ({
  variant = "info",
  className,
  children,
  ...rest
}: BannerProps) => {
  
  const getVariantStyles = () => {
    
    switch (variant) {
      case "error":
        return "mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700";
      
      case "success":
        return "mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700";
      
      case "warning":
        return "mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700";
      
      case "info":
      default:
        return "mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700";
    }
  };

  return (
    <div
      className={cn(
        "py-3 text-sm text-black-700",
        getVariantStyles(),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
