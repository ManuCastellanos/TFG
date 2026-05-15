import { SkelBox, SkelChip, SkelCircle, SkelLine } from '@/components/ui/skeleton';
import { Page } from '@/components/ui/page/Page';

function BannerSkeleton() {
  return (
    <div className="pc-shimmer rounded-3xl border border-(--border) mb-6 p-5">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div className="flex flex-col gap-2">
          <SkelLine w="30%" h={10} />
          <SkelLine w="55%" h={22} />
          <SkelLine w="20%" h={12} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="min-w-20 rounded-2xl bg-white/70 px-4 py-3 flex flex-col items-center gap-1">
              <SkelCircle size={28} />
              <SkelLine w={40} h={14} />
              <SkelLine w={30} h={8} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl border-2 border-(--border) bg-white p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <SkelBox w={48} h={48} r={16} />
        <SkelLine w="60%" h={14} />
      </div>
      <SkelBox w="100%" h={8} r={8} />
      <div className="flex justify-between">
        <SkelLine w="25%" h={10} />
        <SkelLine w="15%" h={10} />
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="rounded-3xl border border-(--border) bg-white p-4 flex flex-col gap-3">
      <SkelLine w="40%" h={14} />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <SkelBox key={i} w="100%" h={28} r={8} />
        ))}
      </div>
    </div>
  );
}

function RecentlyAccessedSkeleton() {
  return (
    <div className="rounded-3xl border border-(--border) bg-white p-4 flex flex-col gap-3">
      <SkelLine w="50%" h={14} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <SkelBox w={36} h={36} r={10} />
          <div className="flex-1 flex flex-col gap-1.5">
            <SkelLine w={`${50 + i * 10}%`} h={12} />
            <SkelLine w="30%" h={9} />
          </div>
          <SkelChip w={60} />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <Page>
      <BannerSkeleton />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SkelLine w={120} h={20} />
            <SkelChip w={90} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CalendarSkeleton />
          <RecentlyAccessedSkeleton />
        </div>
      </div>
    </Page>
  );
}
