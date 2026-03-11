// src/pages/register/Register.tsx (o donde lo tengas)
import React, { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "../../components/input/Input";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Banner } from "../../components/banner/Banner";
import { Button } from "../../components/button/Button";
import { Card } from "../../components/card/Card";
import { Page } from "../../components/page/Page";
import { Text } from "../../components/text/Text";
import { cn } from "../../shared/utils/cn";

const EMAIL_NOT_EQUAL = "Los emails no coinciden"; // reemplaza por tu Constants.EMAIL_NOT_EQUAL

type Field =
  | "username"
  | "password"
  | "email"
  | "email2"
  | "firstname"
  | "lastname"
  | "city"
  | "country";

export default function Register() {
  const navigate = useNavigate();
  // const { error, isLoading, signup, fieldErrors } = useSignup();

  // mientras montas el hook, simulamos estado local
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string[]>>>(
    {}
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [city, setCity] = useState("");
  const [country, setCountry] = useState(""); // puedes hacerlo select luego

  // reglas “tipo Moodle” (para pintar múltiples errores a la vez)
  const passwordRuleErrors = useMemo(() => {
    const errs: string[] = [];
    if (!password) return errs;

    if (password.length < 8) errs.push("Passwords must be at least 8 characters long.");
    if (!/\d/.test(password)) errs.push("Passwords must have at least 1 digit(s).");
    if (!/[a-z]/.test(password)) errs.push("Passwords must have at least 1 lower case letter(s).");
    if (!/[A-Z]/.test(password)) errs.push("Passwords must have at least 1 upper case letter(s).");
    // Moodle menciona *, -, # como ejemplo. Aquí acepto “cualquier especial”.
    if (!/[^A-Za-z0-9]/.test(password))
      errs.push("The password must have at least 1 special character(s) such as *, -, or #.");
    return errs;
  }, [password]);

  const hasError = (field: Field) => (fieldErrors[field]?.length ?? 0) > 0;

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    // Validación básica front (required + emails iguales)
    const nextErrors: Partial<Record<Field, string[]>> = {};

    const req = (field: Field, value: string, msg: string) => {
      if (!value.trim()) nextErrors[field] = [...(nextErrors[field] ?? []), msg];
    };

    req("username", username, "Missing username");
    req("password", password, "Missing password");
    req("email", email, "Missing email address");
    req("email2", email2, "Missing email address");
    req("firstname", firstname, "Missing given name");
    req("lastname", lastname, "Missing last name");

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = [...(nextErrors.email ?? []), "Invalid email address"];
    }

    if (email && email2 && email !== email2) {
      nextErrors.email2 = [...(nextErrors.email2 ?? []), EMAIL_NOT_EQUAL];
    }

    // si quieres que los errores de password policy salgan al submit:
    if (password && passwordRuleErrors.length > 0) {
      nextErrors.password = [...(nextErrors.password ?? []), ...passwordRuleErrors];
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    // Llamada al backend (cuando tengas useSignup)
    try {
      setIsLoading(true);

      // const result = await signup({
      //   username, password, email, email2,
      //   firstname, lastname, city, country,
      // });

      // if (!result.ok) { setFieldErrors(mapCodesToMessages(result.fieldErrors)); setGlobalError(...); return; }

      // navigate({ to: "/login", search: { registered: "1" } });
      navigate({ to: "/login" });
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Card>
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
              className={cn(hasError("username") ? "border-(--danger) focus:ring-(--danger)" : "")}
            />
            {hasError("username") && (
              <div className="space-y-1 text-sm text-(--danger)">
                {fieldErrors.username!.map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Contraseña"
              className={cn(hasError("password") ? "border-(--danger) focus:ring-(--danger)" : "")}
            />
            {/* Info tipo Moodle (siempre visible) */}
            <Text className="text-xs text-(--muted)">
              La contraseña debe tener al menos 8 caracteres, 1 dígito, 1 minúscula, 1 mayúscula y 1 carácter especial.
            </Text>

            {hasError("password") && (
              <div className="space-y-1 text-sm text-(--danger)">
                {fieldErrors.password!.map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Correo electrónico"
              className={cn(hasError("email") ? "border-(--danger) focus:ring-(--danger)" : "")}
            />
            {hasError("email") && (
              <div className="space-y-1 text-sm text-(--danger)">
                {fieldErrors.email!.map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              autoComplete="email"
              placeholder="Correo electrónico (otra vez)"
              className={cn(hasError("email2") ? "border-(--danger) focus:ring-(--danger)" : "")}
            />
            {hasError("email2") && (
              <div className="space-y-1 text-sm text-(--danger)">
                {fieldErrors.email2!.map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            )}

              <Input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                autoComplete="given-name"
                placeholder="Nombre"
                className={cn(hasError("firstname") ? "border-(--danger) focus:ring-(--danger)" : "")}
              />
              {hasError("firstname") && (
                <div className="space-y-1 text-sm text-(--danger)">
                  {fieldErrors.firstname!.map((m) => (
                    <div key={m}>{m}</div>
                  ))}
                </div>
          )}

            <Input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                autoComplete="family-name"
                placeholder="Apellidos"
                className={cn(hasError("lastname") ? "border-(--danger) focus:ring-(--danger)" : "")}
              />
              {hasError("lastname") && (
                <div className="space-y-1 text-sm text-(--danger)">
                  {fieldErrors.lastname!.map((m) => (
                    <div key={m}>{m}</div>
                  ))}
                </div>
              )}
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
            {isLoading ? "Creando..." : "Crear nueva cuenta"}
          </Button>

        </form>
      </Card>
    </Page>
  );
}
