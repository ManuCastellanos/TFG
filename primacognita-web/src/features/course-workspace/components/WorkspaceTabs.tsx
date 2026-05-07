import type { WorkspaceTab } from '../types/workspace.types';
import { TEACHER_TABS, STUDENT_TABS } from '../types/workspace.types';

type WorkspaceTabsProps = {
  active: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
  isTeacher: boolean;
};

const WorkspaceTabs = ({ active, onChange, isTeacher }: WorkspaceTabsProps) => {
  const tabs = isTeacher ? TEACHER_TABS : STUDENT_TABS;
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-white rounded-2xl border border-(--border) w-fit mx-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
            active === t.id ? 'bg-[#274E38] text-white shadow-sm' : 'text-(--fg-muted) hover:bg-(--tint-100)'
          }`}
        >
          <span>{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default WorkspaceTabs;
