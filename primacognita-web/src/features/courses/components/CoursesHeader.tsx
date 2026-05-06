import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Text } from '@/components/ui/text/Text';
import { Button } from '@/components/ui/button/Button';
import { Dropdown } from '@/components/navigation/dropdown/Dropdown';
import { DropdownItem } from '@/components/navigation/dropdown/DropdownItem';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

type Props = {
  isTeacher: boolean;
  onCreate: () => void;
  onManage: () => void;
};

export const CoursesHeader = ({ isTeacher, onCreate, onManage }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const handle = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <header className="mb-6 flex items-center justify-between">
      <Text className="text-2xl font-bold text-(--fg)">Mis Cursos</Text>

      {isTeacher && (
        <div className="relative" ref={ref}>
          <Button type="button" variant="ghost" className="p-2" onClick={() => setOpen((o) => !o)}>
            <Plus className="size-5" />
          </Button>

          {open && (
            <Dropdown>
              <DropdownItem onClick={() => handle(onCreate)}>Crear curso</DropdownItem>
              <DropdownItem onClick={() => handle(onManage)}>Gestionar cursos</DropdownItem>
            </Dropdown>
          )}
        </div>
      )}
    </header>
  );
};
