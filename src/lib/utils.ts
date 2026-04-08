import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS de forma inteligente, 
 * resolviendo conflictos de especificidad (gracias a tailwind-merge) 
 * y permitiendo condicionales limpios (gracias a clsx).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}