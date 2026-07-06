import { useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/ui/card/Card';
import { AuthPage } from '@/components/layout/authPage/AuthPage';
import { Text } from '@/components/ui/text/Text';
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

        <Text className="text-sm text-(--muted)">Contacta con el administrador para tus credenciales</Text>
      </Card>
    </AuthPage>
  );
}

export default LoginPage;
