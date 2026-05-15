type SkelCircleProps = {
  size?: number;
  className?: string;
};

export function SkelCircle({ size = 40, className = '' }: SkelCircleProps) {
  return (
    <div className={`pc-shimmer rounded-full ${className}`} style={{ width: size, height: size, flexShrink: 0 }} />
  );
}
