import { useState } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { FormField } from '@/components/ui/formField/FormField';
import { Input } from '@/components/ui/input/Input';
import type { Profile, UpdateProfileParams } from '@/modules/profile/domain/Profile';

type AboutFields = Pick<UpdateProfileParams, 'superpoder' | 'cumpleanos' | 'animal' | 'talento'>;

type EditAboutModalProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (params: AboutFields) => void;
  saving: boolean;
};

export function EditAboutModal({ open, onClose, profile, onSave, saving }: EditAboutModalProps) {
  const [form, setForm] = useState<AboutFields>(() => ({
    superpoder: profile?.about.superpoder ?? '',
    cumpleanos: profile?.about.cumpleanos ?? '',
    animal:     profile?.about.animal     ?? '',
    talento:    profile?.about.talento    ?? '',
  }));

  const set = (key: keyof AboutFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} width="md">
      <Modal.Header title="Sobre mí" subtitle="Cuéntanos algo de ti" onClose={onClose} />
      <form id="edit-about-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6 grid grid-cols-2 gap-4">
          <FormField label="Mi superpoder">
            <Input placeholder="Mi superpoder" value={form.superpoder} onChange={set('superpoder')} />
          </FormField>
          <FormField label="Cumpleaños">
            <Input placeholder="Cumpleaños" value={form.cumpleanos} onChange={set('cumpleanos')} />
          </FormField>
          <FormField label="Animal favorito">
            <Input placeholder="Animal favorito" value={form.animal} onChange={set('animal')} />
          </FormField>
          <FormField label="Lo que mejor se me da">
            <Input placeholder="Lo que mejor se me da" value={form.talento} onChange={set('talento')} />
          </FormField>
        </div>
      </form>
      <Modal.Footer>
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-2xl text-sm font-extrabold text-(--fg-muted) hover:bg-(--tint-100)">
          Cancelar
        </button>
        <button
          type="submit"
          form="edit-about-form"
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
