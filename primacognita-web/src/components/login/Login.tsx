import { useState } from "react";
import AuthRepository from "../../modules/login/infrastructure/AuthRepository";
import TokenStorage from "../../modules/login/infrastructure/TokenStorage";

type Props = {
  baseUrl: string;
  serviceShortName: string;
  onLoggedIn: () => void;
};

export default function Login({ baseUrl, serviceShortName, onLoggedIn }: Props) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const repo = new AuthRepository(baseUrl, serviceShortName);
      const token = await repo.login(identifier, password);
      TokenStorage.set(token);
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Usuario"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
