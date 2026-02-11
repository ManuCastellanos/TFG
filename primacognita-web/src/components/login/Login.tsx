import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import AuthRepository from "../../modules/login/infrastructure/AuthRepository";
import TokenStorage from "../../modules/login/infrastructure/TokenStorage";
import { Eye, EyeOff } from "lucide-react";
import { s } from "./Login.styles";

const INVALID_ACCESS_MSG = "Acceso inválido. Por favor, inténtelo otra vez.";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState<"es" | "en">("es");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const repo = new AuthRepository();
      const token = await repo.login(username, password);
      TokenStorage.set(token);
      navigate({ to: "/dashboard" });
    } catch {
      setError(INVALID_ACCESS_MSG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>Acceder a Prima Cognita</h1>
        <p className={s.subtitle}>Entra con tu usuario del cole.</p>

        {error && <div className={s.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={s.form}>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder=" "
              className={s.floatingInput}
            />
            <label className={s.floatingLabel}>Usuario</label>
          </div>

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder=" "
              className={s.floatingInputWithIcon}
            />

            <label className={s.floatingLabel}>Contraseña</label>

            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className={s.iconBtn}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className={s.primaryBtn}>
            {loading ? "Entrando..." : "Log in"}
          </button>
        </form>

        <div className={s.divider} />

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Registrarse como usuario</h2>
          <p className={s.sectionText}>
            Para acceder a esta página debe crear una cuenta primero.
          </p>

          <button
            type="button"
            className={s.secondaryBtn}
            onClick={() => navigate({ to: "/register" })}
          >
            Crear nueva cuenta
          </button>
        </section>
      </div>

      <div className={s.pageFooter}>
        <select
          className={s.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value as "es" | "en")}
          aria-label="Idioma"
        >
          <option value="es">Español - Internacional (es)</option>
          <option value="en">English (en)</option>
        </select>
      </div>
    </div>
  );
}
