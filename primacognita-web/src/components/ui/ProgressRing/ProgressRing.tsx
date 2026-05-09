type Props = {
  value: number;
  size?: number;
  color?: string;
};

export function ProgressRing({ value, size = 56, color = '#10b981' }: Props) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#e5e5e5" strokeWidth="6"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="50%" textAnchor="middle" dy=".35em"
        fontSize={size < 48 ? 10 : 13}
        fontWeight="800"
        fill="#262626"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
}
