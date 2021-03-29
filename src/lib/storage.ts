import { Env } from './env';
import { StreamCreds } from './types';

const CredsKey = 'creds';

export function getStoredCreds(): StreamCreds {
  const val = getItem(CredsKey);
  const fallback = { clientId: '', streamKey: '' };
  return val ? JSON.parse(val) : fallback ?? fallback;
}

export function setStoredCreds(creds: StreamCreds): void {
  setItem(CredsKey, JSON.stringify(creds));
}

function setItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(envKey(key), value);
}

function getItem(key: string): string | undefined {
  if (typeof window === 'undefined') return;

  return window.localStorage.getItem(envKey(key)) ?? undefined;
}

function envKey(key: string): string {
  return `vertexvis:${Env}:${key}`;
}
