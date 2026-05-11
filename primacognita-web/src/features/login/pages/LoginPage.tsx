import { useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/ui/card/Card';
import { AuthPage } from '@/components/layout/authPage/AuthPage';
import { Text } from '@/components/ui/text/Text';
import { Button } from '@/components/ui/button/Button';
import { useLogin } from '../hooks/useLogin';
import { LoginForm } from '../components/LoginForm';
import type { LoginCredentials } from '../types/login.types';

function LoginPage() {
  const navigate = useNavigate();
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (credentials: LoginCredentials) => {
    const success = await login(credentials);

    if (success) {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <AuthPage>
      <Card variant="auth">
        <LoginForm
          onSubmit={handleSubmit}
          onForgotPassword={() => navigate({ to: '/forgot_password' })}
          isLoading={isLoading}
          error={error}
        />

        <div className="my-6 h-px bg-(--border)" />

        <section className="space-y-2">
          <Text className="text-xl font-semibold text-(--fg)">Registrarse como usuario</Text>
          <Text className="max-w-xs text-sm text-(--muted)">Crea tu cuenta para acceder al campus virtual.</Text>

          <Button type="button" variant="outline" className="mt-3" onClick={() => navigate({ to: '/signup' })}>
            Crear nueva cuenta
          </Button>
        </section>
      </Card>
    </AuthPage>
  );
}

export default LoginPage;
