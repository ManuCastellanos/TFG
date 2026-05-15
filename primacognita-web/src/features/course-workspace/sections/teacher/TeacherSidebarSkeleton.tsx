import { SkelBox, SkelChip, SkelCircle, SkelLine } from '@/components/ui/skeleton';

function PendingPanelSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <SkelLine w={90} h={14} />
        <SkelChip w={28} />
      </div>
      <div className="flex flex-col gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <SkelBox w={36} h={36} r={12} />
            <div className="flex-1 flex flex-col gap-1.5">
              <SkelLine w={`${55 + ((i * 9) % 25)}%`} h={12} />
              <SkelLine w="40%" h={9} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassRosterSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <SkelLine w={70} h={14} />
        <SkelLine w={55} h={10} />
      </div>
      <div className="flex flex-col gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <SkelCircle size={36} className="rounded-xl" />
            <div className="flex-1 flex flex-col gap-1.5">
              <SkelLine w={`${50 + ((i * 11) % 30)}%`} h={12} />
              <SkelBox w="100%" h={6} r={6} />
            </div>
            <SkelLine w={30} h={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <PendingPanelSkeleton />
      <ClassRosterSkeleton />
    </div>
  );
}
