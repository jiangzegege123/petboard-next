import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function baseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
}

export function getSessionStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = window.sessionStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setSessionStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function addNewRecordId(tableId: string, recordId: number | string) {
  if (typeof window === 'undefined') return;
  try {
    const key = `${tableId}_newRecordIds`;
    const existing = getSessionStorage<string[]>(key, []);
    const updated = Array.isArray(existing) ? [...existing] : [];
    const recordKey = String(recordId);
    const existingIndex = updated.indexOf(recordKey);
    if (existingIndex !== -1) updated.splice(existingIndex, 1);
    updated.unshift(recordKey);
    setSessionStorage(key, updated);
    window.dispatchEvent(new Event('sessionStorageUpdated'));
  } catch {
    // ignore
  }
}

export function scrollToFirstError() {
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 0);
}

export const BADGE_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-800',
  INACTIVE: 'bg-gray-100 text-gray-400 border-gray-400',
  BOOKED: 'bg-blue-100 text-blue-800 border-blue-800',
  CHECKED_IN: 'bg-yellow-100 text-yellow-900 border-yellow-900',
  CHECKED_OUT: 'bg-green-100 text-green-900 border-green-900',
  CANCELLED: 'bg-red-100 text-red-900 border-red-900',
  PAID: 'bg-green-100 text-green-800 border-green-800',
  UNPAID: 'bg-red-100 text-red-800 border-red-800',
  OVERDUE: 'bg-orange-100 text-orange-800 border-orange-800',
};
