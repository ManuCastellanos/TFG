import { SkelBox, SkelLine } from '@/components/ui/skeleton';

function CourseCardSkeleton({ idx }: { idx: number }) {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden border-2 border-(--border) bg-white">
      <SkelBox w="100%" h={128} r={0} />
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <SkelLine w={`${60 + ((idx * 13) % 25)}%`} h={14} />
          <SkelLine w={`${30 + ((idx * 7) % 20)}%`} h={10} />
        </div>
        <div className="flex flex-col gap-1.5">
          <SkelBox w="100%" h={8} r={8} />
          <SkelLine w="35%" h={10} />
        </div>
      </div>
    </div>
  );
}

export function CoursesGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-4 content-start">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} idx={i} />
      ))}
    </div>
  );
}
