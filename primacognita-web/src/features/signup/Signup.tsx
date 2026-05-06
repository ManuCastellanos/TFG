import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input/Input';
import { PasswordInput } from '@/components/ui/input/PasswordInput';
import { Banner } from '@/components/feedback/banner/Banner';
import { Button } from '@/components/ui/button/Button';
import { Card } from '@/components/ui/card/Card';
import { Page } from '@/components/layout/page/Page';
import { Text } from '@/components/ui/text/Text';
import { cn } from '@/shared/utils/cn';
import { useSignup } from './useSignup';
import type { SignupField } from './signup.utils';

function FieldErrorList({ errors }: { errors: string[] }) {
  return (
    <div className="space-y-1 text-sm text-(--danger)">
      {errors.map((m) => (
        <div key={m}>{m}</div>
      ))}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { isLoading, globalError, fieldErrors, signup } = useSignup();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const hasError = (field: SignupField) => (fieldErrors[field]?.length ?? 0) > 0;

  const errorClass = (field: SignupField) =>
    cn(hasError(field) ? 'border-(--danger) focus:ring-(--danger)' : '');

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const ok = await signup({ username, password, email, email2, firstname, lastname, city, country });
    if (ok) navigate({ to: '/login' });
  };

  return (
    <Page>
      <Card variant="auth">
        <Text className="text-2xl font-bold text-(--fg)">Crear cuenta</Text>
        <Text className="mt-1 text-sm text-(--muted)">
          Crea tu cuenta para acceder al campus virtual.
        </Text>

        {globalError && <Banner variant="error">{globalError}</Banner>}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Usuario"
              className={errorClass('username')}
            />
            {hasError('username') && <FieldErrorList errors={fieldErrors.username!} />}
          </div>

          <div className="space-y-2">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Contraseña"
              className={errorClass('password')}
            />
            <Text className="text-xs text-(--muted)">
              Al menos 8 caracteres, 1 dígito, 1 minúscula, 1 mayúscula y 1 carácter especial.
            </Text>
            {hasError('password') && <FieldErrorList errors={fieldErrors.password!} />}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Correo electrónico"
              className={errorClass('email')}
            />
            {hasError('email') && <FieldErrorList errors={fieldErrors.email!} />}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              autoComplete="email"
              placeholder="Correo electrónico (otra vez)"
              className={errorClass('email2')}
            />
            {hasError('email2') && <FieldErrorList errors={fieldErrors.email2!} />}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              autoComplete="given-name"
              placeholder="Nombre"
              className={errorClass('firstname')}
            />
            {hasError('firstname') && <FieldErrorList errors={fieldErrors.firstname!} />}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              autoComplete="family-name"
              placeholder="Apellidos"
              className={errorClass('lastname')}
            />
            {hasError('lastname') && <FieldErrorList errors={fieldErrors.lastname!} />}
          </div>

          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
            placeholder="Ciudad"
          />

          <Input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country"
            placeholder="País"
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear nueva cuenta'}
          </Button>
        </form>
      </Card>
    </Page>
  );
}
