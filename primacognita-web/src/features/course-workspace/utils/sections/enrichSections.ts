import type { CourseSection } from '@/modules/course/domain/CourseSection';

export type EnrichedSection = {
  section: CourseSection;
  colorIdx: number;
  sectionNumber: number;
  progress?: number;
};

export function enrichSections(sections: CourseSection[]): EnrichedSection[] {
  return sections.reduce<{ items: EnrichedSection[]; idx: number }>(
    (acc, section, index) => {
      const isGeneral = index === 0;
      const colorIdx = isGeneral ? -1 : acc.idx;
      const sectionNumber = isGeneral ? 0 : acc.idx + 1;

      const withCompletion = section.modules.filter((m) => m.completion?.hasCompletion);
      const done = withCompletion.filter((m) => (m.completion?.state ?? 0) >= 1).length;

      acc.items.push({
        section,
        colorIdx,
        sectionNumber,
        progress: withCompletion.length > 0 ? Math.round((done / withCompletion.length) * 100) : undefined,
      });

      if (!isGeneral) acc.idx++;
      return acc;
    },
    { items: [], idx: 0 },
  ).items;
}
