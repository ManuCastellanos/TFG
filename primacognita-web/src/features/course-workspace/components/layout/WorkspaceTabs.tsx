import type { WorkspaceTab, WorkspaceTabId } from '../../config/workspace-tabs.config';

type WorkspaceTabsProps = {
  tabs: WorkspaceTab[];
  active: WorkspaceTabId;
  onChange: (tab: WorkspaceTabId) => void;
};

const WorkspaceTabs = ({ tabs, active, onChange }: WorkspaceTabsProps) => (
  <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-white rounded-2xl border border-(--border) w-fit mx-auto">
    {tabs.map((t) => (
      <button
        key={t.key}
        type="button"
        onClick={() => onChange(t.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
          active === t.id ? 'bg-[#274E38] text-white shadow-sm' : 'text-(--fg-muted) hover:bg-(--tint-100)'
        }`}
      >
        <span>{t.icon}</span>
        <span>{t.label}</span>
      </button>
    ))}
  </div>
);

export default WorkspaceTabs;
