import { SkelBox, SkelLine } from '@/components/ui/skeleton';
import { Page } from '@/components/ui/page/Page';

export function QuizContentSkeleton() {
  return (
    <Page>
      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-(--border) p-4 mb-6 flex flex-col gap-3">
        <div className="flex justify-between">
          <SkelLine w="30%" h={14} />
          <SkelLine w="25%" h={12} />
        </div>
        <SkelBox w="100%" h={8} r={8} />
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* Question area */}
        <div className="bg-white rounded-3xl border border-(--border) p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <SkelLine w="70%" h={16} />
            <SkelLine w="85%" h={14} />
            <SkelLine w="55%" h={14} />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-(--border)">
                <SkelBox w={20} h={20} r={10} />
                <SkelLine w={`${40 + i * 10}%`} h={12} />
              </div>
            ))}
          </div>
        </div>

        {/* Question palette */}
        <div className="bg-white rounded-3xl border border-(--border) p-5 flex flex-col gap-4">
          <SkelLine w="60%" h={14} />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkelBox key={i} w="100%" h={36} r={10} />
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <SkelBox w="100%" h={40} r={12} />
          </div>
        </div>
      </div>
    </Page>
  );
}
