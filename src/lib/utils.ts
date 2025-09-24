import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureRole<T extends { role?: string }>(user: T | null, roles: string[]): boolean {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
}