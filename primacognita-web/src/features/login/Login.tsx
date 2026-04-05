import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "../../components/input/Input";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Banner } from "../../components/banner/Banner";
import { Button } from "../../components/button/Button";
import { Card } from "../../components/card/Card";
import { Page } from "../../components/page/Page";
import { Text } from "../../components/text/Text";
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
      <Card variant="auth">
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
              variant="ghost"
              onClick={() => navigate({ to: "/forgot_password" })}
            >
              <span className="text-sm hover:underline">¿Olvidó su contraseña?</span>
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
            variant="outline"
            className="mt-3"
            onClick={() => navigate({ to: "/signup" })}
          >
            Crear nueva cuenta
          </Button>
        </section>
      </Card>
    </Page>
  );
}
