import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de forma inteligente:
 * - clsx → condicionales
 * - twMerge → evita conflictos en Tailwind (p-2 vs p-4, etc)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
