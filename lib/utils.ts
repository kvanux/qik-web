import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const yearList = [
  ...Array(2086 - 2000 + 1).fill(2000).map((year, index) => year + index),
] as const;