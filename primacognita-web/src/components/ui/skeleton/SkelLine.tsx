type SkelLineProps = {
  w?: string | number;
  h?: number;
  className?: string;
};

export function SkelLine({ w = '100%', h = 12, className = '' }: SkelLineProps) {
  return (
    <div
      className={`pc-shimmer rounded-full ${className}`}
      style={{ width: typeof w === 'number' ? `${w}px` : w, height: h }}
    />
  );
}
