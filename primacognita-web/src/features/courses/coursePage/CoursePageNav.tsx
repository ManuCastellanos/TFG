import { cn } from "@/shared/utils/cn";

export type CoursePageSection = "temario" | "ejercicios";

type SectionTile = {
  id: CoursePageSection;
  label: string;
  gradient: string;
  emoji: string;
};

const SECTION_TILES: readonly SectionTile[] = [
  {
    id: "temario",
    label: "Temario",
    emoji: "📚",
    gradient: "from-[var(--course-green-from)] to-[var(--course-emerald-to)]",
  },
  {
    id: "ejercicios",
    label: "Ejercicios",
    emoji: "✏️",
    gradient: "from-[var(--course-yellow-from)] to-[var(--course-orange-to)]",
  },
];

export type CoursePageNavProps = {
  active: CoursePageSection;
  onChange: (section: CoursePageSection) => void;
};

export const CoursePageNav = ({ active, onChange }: CoursePageNavProps) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {SECTION_TILES.map((tile) => {
      const isActive = active === tile.id;

      return (
        <button
          key={tile.id}
          type="button"
          onClick={() => onChange(tile.id)}
          aria-pressed={isActive}
          className={cn(
            "group relative flex flex-col items-start gap-3 overflow-hidden rounded-3xl p-6 text-left",
            "bg-linear-to-br text-white shadow-(--shadow-sm)",
            "transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-(--shadow-md)",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring-strong)",
            tile.gradient,
            isActive && "ring-4 ring-white/70 shadow-(--shadow-md)",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-12 items-center justify-center rounded-2xl bg-white/30 text-2xl backdrop-blur-sm"
            >
              {tile.emoji}
            </span>
          </div>

          <span className="text-shadow-md text-2xl font-extrabold leading-tight">
            {tile.label}
          </span>
        </button>
      );
    })}
  </div>
);
