import { gradeColor, formatGrade } from '../utils/gradeColor';

type Props = {
  grade: number | null;
};

export function GradeCell({ grade }: Props) {
  return (
    <div
      className={`inline-flex items-center justify-center min-w-[58px] rounded-xl font-extrabold py-1.5 px-2 text-sm ${gradeColor(grade)}`}
    >
      {formatGrade(grade)}
    </div>
  );
}
