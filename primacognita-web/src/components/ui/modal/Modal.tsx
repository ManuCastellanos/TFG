import { useEffect, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

const WIDTH_MAP = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
} as const;

// ─── ModalHeader ─────────────────────────────────────────────────────────────

type ModalHeaderProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
};

function ModalHeader({ icon, title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start gap-4 px-7 pt-6 pb-5 border-b border-(--border) shrink-0">
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-(--fg) leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-(--fg-muted) mt-0.5">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="size-9 rounded-xl bg-(--tint-100) hover:bg-(--tint-200) text-(--fg-muted) grid place-items-center text-xl leading-none shrink-0"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}

// ─── ModalFooter ─────────────────────────────────────────────────────────────

type ModalFooterProps = {
  children: ReactNode;
};

function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-7 py-4 bg-(--tint-50) border-t border-(--border) shrink-0">
      {children}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

type ModalProps = {
  open: boolean;
  onClose: () => void;
  width?: keyof typeof WIDTH_MAP;
  children: ReactNode;
};

function ModalRoot({ open, onClose, width = "lg", children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 backdrop-blur-sm p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full bg-white rounded-3xl border border-(--border) shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
          WIDTH_MAP[width],
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Footer: ModalFooter,
});

export type { ModalProps, ModalHeaderProps, ModalFooterProps };
