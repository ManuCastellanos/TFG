type SkelBoxProps = {
  w?: string | number;
  h?: number;
  r?: number;
  className?: string;
};

export function SkelBox({ w = '100%', h = 80, r = 16, className = '' }: SkelBoxProps) {
  return (
    <div
      className={`pc-shimmer ${className}`}
      style={{ width: typeof w === 'number' ? `${w}px` : w, height: h, borderRadius: r }}
    />
  );
}
