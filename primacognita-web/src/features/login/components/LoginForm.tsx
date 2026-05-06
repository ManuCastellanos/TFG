import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import { PasswordInput } from '@/components/ui/input/PasswordInput';
import { Banner } from '@/components/feedback/banner/Banner';
import { Button } from '@/components/ui/button/Button';
import { Text } from '@/components/ui/text/Text';
import type { LoginCredentials } from '../types/login.types';

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500">{message}</p> : null;

type Props = {
  onSubmit: (data: LoginCredentials) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  error: string | null;
};

export const LoginForm = ({ onSubmit, onForgotPassword, isLoading, error }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  return (
    <>
      <Text className="text-2xl font-bold text-(--fg)">Acceder a Prima Cognita</Text>

      {error && <Banner variant="error">{error}</Banner>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1">
          <Input
            type="text"
            {...register('username', { required: 'El usuario es obligatorio' })}
            autoComplete="username"
            placeholder="Usuario"
          />
          <FieldError message={errors.username?.message} />
        </div>

        <div className="space-y-1">
          <PasswordInput
            {...register('password', { required: 'La contraseña es obligatoria' })}
            autoComplete="current-password"
            placeholder="Contraseña"
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Acceder'}
        </Button>

        <div className="flex items-center justify-center">
          <Button type="button" variant="ghost" onClick={onForgotPassword}>
            <span className="text-sm hover:underline">¿Olvidó su contraseña?</span>
          </Button>
        </div>
      </form>
    </>
  );
};
