import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { FormField } from '@/components/ui/formField/FormField';
import { Input } from '@/components/ui/input/Input';
import type { Profile, UpdateProfileParams } from '@/modules/profile/domain/Profile';

type FamilyFields = Pick<
  UpdateProfileParams,
  'tutor1_nombre' | 'tutor1_email' | 'tutor1_telefono' |
  'tutor2_nombre' | 'tutor2_email' | 'tutor2_telefono'
>;

type EditFamilyModalProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (params: FamilyFields) => void;
  saving: boolean;
};

function emptyFamily(): FamilyFields {
  return {
    tutor1_nombre: '', tutor1_email: '', tutor1_telefono: '',
    tutor2_nombre: '', tutor2_email: '', tutor2_telefono: '',
  };
}

export function EditFamilyModal({ open, onClose, profile, onSave, saving }: EditFamilyModalProps) {
  const [form, setForm] = useState<FamilyFields>(emptyFamily());

  useEffect(() => {
    if (!profile || !open) return;
    const t1 = profile.family[0];
    const t2 = profile.family[1];
    setForm({
      tutor1_nombre:   t1?.nombre   ?? '',
      tutor1_email:    t1?.email    ?? '',
      tutor1_telefono: t1?.telefono ?? '',
      tutor2_nombre:   t2?.nombre   ?? '',
      tutor2_email:    t2?.email    ?? '',
      tutor2_telefono: t2?.telefono ?? '',
    });
  }, [profile, open]);

  const set = (key: keyof FamilyFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} width="md">
      <Modal.Header title="Familia" subtitle="Datos de los tutores" onClose={onClose} />
      <form id="edit-family-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6 flex flex-col gap-6">
          <section>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-3">Tutor 1</h3>
            <div className="flex flex-col gap-4">
              <FormField label="Nombre">
                <Input placeholder="Nombre" value={form.tutor1_nombre} onChange={set('tutor1_nombre')} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Email">
                  <Input placeholder="Email" type="email" value={form.tutor1_email} onChange={set('tutor1_email')} />
                </FormField>
                <FormField label="Teléfono">
                  <Input placeholder="Teléfono" value={form.tutor1_telefono} onChange={set('tutor1_telefono')} />
                </FormField>
              </div>
            </div>
          </section>
          <div className="border-t border-(--border)" />
          <section>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-3">Tutor 2</h3>
            <div className="flex flex-col gap-4">
              <FormField label="Nombre">
                <Input placeholder="Nombre" value={form.tutor2_nombre} onChange={set('tutor2_nombre')} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Email">
                  <Input placeholder="Email" type="email" value={form.tutor2_email} onChange={set('tutor2_email')} />
                </FormField>
                <FormField label="Teléfono">
                  <Input placeholder="Teléfono" value={form.tutor2_telefono} onChange={set('tutor2_telefono')} />
                </FormField>
              </div>
            </div>
          </section>
        </div>
      </form>
      <Modal.Footer>
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-2xl text-sm font-extrabold text-(--fg-muted) hover:bg-(--tint-100)">
          Cancelar
        </button>
        <button
          type="submit"
          form="edit-family-form"
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
