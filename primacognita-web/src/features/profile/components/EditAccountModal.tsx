import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import { FormField } from '@/components/ui/formField/FormField';
import { Input } from '@/components/ui/input/Input';
import type { User } from '@/modules/user/domain/User';
import type { UpdateAccountParams, ChangePasswordParams } from '@/modules/profile/domain/Profile';

type EditAccountModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
  onSaveAccount: (params: UpdateAccountParams) => void;
  onChangePassword: (params: ChangePasswordParams) => void;
  savingAccount: boolean;
  savingPassword: boolean;
  passwordError: string | null;
};

export function EditAccountModal({
  open,
  onClose,
  user,
  onSaveAccount,
  onChangePassword,
  savingAccount,
  savingPassword,
  passwordError,
}: EditAccountModalProps) {
  const nameParts = user.fullName.trim().split(' ');
  const defaultFirstname = user.firstName || nameParts[0] || '';
  const defaultLastname  = nameParts.slice(1).join(' ') || '';

  const [firstname, setFirstname]             = useState(defaultFirstname);
  const [lastname, setLastname]               = useState(defaultLastname);
  const [pictureFile, setPictureFile]         = useState<File | null>(null);
  const [picturePreview, setPicturePreview]   = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMatchError, setPwMatchError]       = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAccount({ firstname, lastname, pictureFile: pictureFile ?? undefined, userId: user.id });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwMatchError('Las contraseñas no coinciden');
      return;
    }
    setPwMatchError('');
    onChangePassword({ currentpassword: currentPassword, newpassword: newPassword });
  };

  const avatarSrc = picturePreview ?? user.avatarUrl ?? null;
  const initials  = user.fullName.trim().slice(0, 1).toUpperCase();

  return (
    <Modal open={open} onClose={onClose} width="md">
      <Modal.Header title="Editar perfil" subtitle="Nombre, foto y contraseña" onClose={onClose} />

      <div className="flex-1 overflow-y-auto">
        {/* ── Nombre y foto ── */}
        <form id="edit-account-form" onSubmit={handleSaveAccount} className="p-6 flex flex-col gap-5 border-b border-(--border)">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle)">Datos de la cuenta</h3>

          {/* Avatar picker */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group shrink-0"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="size-20 rounded-2xl object-cover border-2 border-(--border)" />
              ) : (
                <div className="size-20 rounded-2xl bg-linear-to-br from-sky-300 to-sky-500 grid place-items-center text-white font-extrabold text-3xl border-2 border-(--border)">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/40 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl">
                📷
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="text-xs text-(--fg-muted) leading-relaxed">
              Haz clic en la imagen para<br />cambiar tu foto de perfil.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre">
              <Input placeholder="Nombre" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            </FormField>
            <FormField label="Apellidos">
              <Input placeholder="Apellidos" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </FormField>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingAccount}
              className="px-5 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60"
            >
              {savingAccount ? 'Guardando…' : 'Guardar datos'}
            </button>
          </div>
        </form>

        {/* ── Contraseña ── */}
        <form id="edit-password-form" onSubmit={handleChangePassword} className="p-6 flex flex-col gap-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-(--fg-subtle)">Cambiar contraseña</h3>

          <FormField label="Contraseña actual">
            <Input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Nueva contraseña">
            <Input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Confirmar nueva contraseña" error={pwMatchError}>
            <Input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="px-5 py-2.5 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 disabled:opacity-60"
            >
              {savingPassword ? 'Cambiando…' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
