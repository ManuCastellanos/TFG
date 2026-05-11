type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterChip = ({ label, active, onClick }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-sm transition border-2 ${
      active
        ? 'bg-[#274E38] text-white border-[#274E38]'
        : 'bg-white text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
    }`}
  >
    {label}
  </button>
);

export default FilterChip;
