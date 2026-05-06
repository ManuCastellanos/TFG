import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";
import { cardStyles, type CardVariant } from "./card.styles";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export const Card = ({ className, variant = "default", ...props }: CardProps) => {
  return (
    <div
      className={cn(cardStyles.base, cardStyles.variants[variant], className)}
      {...props}
    />
  );
};
