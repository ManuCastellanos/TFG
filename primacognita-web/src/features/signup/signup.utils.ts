import { Constants } from '@/shared/constants/Constants';

export type SignupField =
  | 'username'
  | 'password'
  | 'email'
  | 'email2'
  | 'firstname'
  | 'lastname'
  | 'city'
  | 'country';

export type FieldErrors = Partial<Record<SignupField, string[]>>;

export function validatePasswordRules(password: string): string[] {
  if (!password) return [];
  const errors: string[] = [];
  if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres.');
  if (!/\d/.test(password)) errors.push('La contraseña debe tener al menos 1 dígito.');
  if (!/[a-z]/.test(password)) errors.push('La contraseña debe tener al menos 1 minúscula.');
  if (!/[A-Z]/.test(password)) errors.push('La contraseña debe tener al menos 1 mayúscula.');
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push('La contraseña debe tener al menos 1 carácter especial (*, -, #…).');
  return errors;
}

interface SignupFormValues {
  username: string;
  password: string;
  email: string;
  email2: string;
  firstname: string;
  lastname: string;
}

export function validateSignupForm(values: SignupFormValues): FieldErrors {
  const errors: FieldErrors = {};

  const require = (field: SignupField, value: string, msg: string) => {
    if (!value.trim()) errors[field] = [...(errors[field] ?? []), msg];
  };

  require('username', values.username, 'El nombre de usuario es obligatorio.');
  require('password', values.password, 'La contraseña es obligatoria.');
  require('email', values.email, 'El correo electrónico es obligatorio.');
  require('email2', values.email2, 'Confirma tu correo electrónico.');
  require('firstname', values.firstname, 'El nombre es obligatorio.');
  require('lastname', values.lastname, 'Los apellidos son obligatorios.');

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = [...(errors.email ?? []), 'Dirección de correo no válida.'];
  }

  if (values.email && values.email2 && values.email !== values.email2) {
    errors.email2 = [...(errors.email2 ?? []), Constants.EMAIL_NOT_EQUAL];
  }

  const passwordErrors = validatePasswordRules(values.password);
  if (passwordErrors.length > 0) {
    errors.password = [...(errors.password ?? []), ...passwordErrors];
  }

  return errors;
}
