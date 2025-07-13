// @/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Additional utilities you might want
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US').format(date)
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}