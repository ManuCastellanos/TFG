type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const DropdownItem = ({ children, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
  >
    {children}
  </button>
);
