import { cn } from "@/shared/utils/cn";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-9 text-[10px]",
  md: "size-12 text-xs",
  lg: "size-15 text-sm",
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const Avatar = ({
  src,
  alt,
  size = "md",
  className,
}: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-(--color-pr) font-semibold text-white",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(alt)}
    </div>
  );
};