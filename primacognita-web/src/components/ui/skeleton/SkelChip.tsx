type SkelChipProps = {
  w?: number;
};

export function SkelChip({ w = 80 }: SkelChipProps) {
  return <div className="pc-shimmer rounded-full" style={{ width: w, height: 24, flexShrink: 0 }} />;
}
