import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "../../components/form/Input";
import { PasswordInput } from "../../components/form/PasswordInput";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Page } from "../../components/ui/Page";
import { Text } from "../../components/ui/Text";
import { cn } from "../../shared/utils/cn";
import { useLogin } from "./useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { error, isLoading, login } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  
    const success = await login(username, password);
  
    if (success) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <Page>
      <Card>
        <Text className="text-2xl font-bold text-(--fg)">
          Acceder a Prima Cognita
        </Text>

        {error && <Banner variant="error">{error}</Banner>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Usuario"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Contraseña"
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Acceder"}
          </Button>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              className="w-fit bg-transparent p-0 hover:bg-transparent"
              onClick={() => navigate({ to: "/forgot_password" })}
            >
              <p className="w-full text-center text-sm text-(--pr-700) hover:underline">
                ¿Olvidó su contraseña?
              </p>
            </Button>
          </div>
        </form>

        <div className="my-6 h-px bg-(--border)" />

        <section className="space-y-2">
          <Text className="text-xl font-semibold text-(--fg)">
            Registrarse como usuario
          </Text>
          <Text className="max-w-xs text-sm text-(--muted)">
            Crea tu cuenta para acceder al campus virtual.
          </Text>

          <Button
            type="button"
            className={cn(
              "mt-3 w-full rounded-xl border px-4 py-3 text-sm font-medium",
              "border-[--border] bg-transparent text-(--fg)",
              "hover:border-[--muted-2] hover:bg-[--surface]",
              "focus:ring-2 focus:ring-[--color-ring]"
            )}
            onClick={() => navigate({ to: "/signup" })}
          >
            Crear nueva cuenta
          </Button>
        </section>
      </Card>
    </Page>
  );
}
