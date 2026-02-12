import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import type { InputProps } from "./Input";
import { Input } from "./Input";

export const PasswordInput = (props: Omit<InputProps, "type">) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      rightAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {!isVisible ? <EyeOff size={18} color="#079465" /> : <Eye size={18} color="#079465" />}
        </button>
      }
    />
  );
};
