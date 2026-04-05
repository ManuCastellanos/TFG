import { useState } from "react";
import { Input } from "../../components/input/Input";
import { Card } from "../../components/card/Card";
import { Page } from "../../components/page/Page";
import { Text } from "../../components/text/Text";
import { Button } from "../../components/button/Button";
import { useNavigate } from "@tanstack/react-router";
import { Banner } from "../../components/banner/Banner";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInfo(
      "En esta prueba de concepto, la recuperación de contraseña por email no está disponible porque el servidor de correo (SMTP) no está configurado en el entorno actual.",
    );
    setSubmitted(true);
  };

  return (
    <Page>
      <Card variant="auth">
        {!submitted ? (
          <>
            <Text>
              Para restablecer su contraseña, envíe su nombre de usuario o su
              dirección de correo electrónico. Le enviaremos un email con
              instrucciones para poder acceder de nuevo.
            </Text>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Text className="text-xl font-bold text-(--fg)">
                Buscar por nombre de usuario
              </Text>

              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Usuario"
              />

              <div className="flex items-center justify-center">
                <Button type="submit" className="w-fit">
                  Enviar
                </Button>
              </div>

              <div className="my-6 h-px bg-(--border)" />

              <Text className="text-xl font-bold text-(--fg)">
                Buscar por correo electrónico
              </Text>

              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Email"
              />

              <div className="flex items-center justify-center">
                <Button type="submit" className="w-fit">
                  Enviar
                </Button>
              </div>

              <div className="my-6 h-px bg-(--border)" />

              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  className="w-fit bg-transparent p-0 hover:bg-transparent"
                  onClick={() => navigate({ to: "/" })}
                >
                  <p className="w-full text-center text-sm text-(--pr-700) hover:underline">
                    Atrás
                  </p>
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <Text className="text-xl font-bold text-(--fg)">
              Recuperación de contraseña (PoC)
            </Text>

            {info && <Banner className= "text-md" variant="info">{info}</Banner>}

            <div className="flex items-center justify-center pt-2">
              <Button onClick={() => navigate({ to: "/" })}>
                Volver a login
              </Button>
            </div>
          </div>
        )}
      </Card>
    </Page>
  );
}
