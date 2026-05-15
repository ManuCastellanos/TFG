import { SkelBox, SkelLine } from '@/components/ui/skeleton';

function SectionCardSkeleton() {
  return (
    <div className="rounded-3xl border border-(--border) bg-white overflow-hidden mb-2">
      <div className="flex items-center gap-4 p-5">
        <SkelBox w={56} h={56} r={16} />
        <div className="flex-1 flex flex-col gap-2">
          <SkelLine w="45%" h={16} />
          <SkelLine w="30%" h={11} />
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-2xl border border-(--border)">
            <SkelBox w={36} h={36} r={10} />
            <div className="flex-1 flex flex-col gap-1.5">
              <SkelLine w={`${50 + i * 12}%`} h={12} />
              <SkelLine w="25%" h={9} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2].map((i) => (
        <SectionCardSkeleton key={i} />
      ))}
    </div>
  );
}
