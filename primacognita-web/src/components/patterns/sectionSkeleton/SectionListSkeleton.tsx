import { SkelBox, SkelChip, SkelCircle, SkelLine } from '@/components/ui/skeleton';

type SectionListSkeletonProps = {
  rows?: number;
};

export function SectionListSkeleton({ rows = 4 }: SectionListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-(--border) bg-white">
          <SkelCircle size={32} />
          <SkelBox w={40} h={40} r={12} />
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <SkelLine w={`${45 + ((i * 11) % 35)}%`} h={12} />
            <SkelLine w={`${25 + ((i * 7) % 20)}%`} h={9} />
          </div>
          <SkelChip w={70} />
        </div>
      ))}
    </div>
  );
}
