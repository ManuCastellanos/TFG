import { SkelBox, SkelLine } from '@/components/ui/skeleton';

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-(--border) p-4">
      <div className="flex items-center gap-3">
        <SkelBox w={44} h={44} r={12} />
        <div className="flex flex-col gap-1.5 flex-1">
          <SkelLine w="40%" h={10} />
          <SkelLine w="55%" h={18} />
          <SkelLine w="45%" h={9} />
        </div>
      </div>
    </div>
  );
}

export function TeacherStatsBarSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}
