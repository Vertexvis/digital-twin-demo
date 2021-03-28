import { Env } from './env';

export enum StorageKey {
  ClientId,
  StreamKey,
}

export function getClientId(): string {
  return getItem(StorageKey.ClientId) ?? '';
}

export function getStreamKey(): string {
  return getItem(StorageKey.StreamKey) ?? '';
}

export function setItem(key: StorageKey, value: string): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(envKey(key), value);
}

function getItem(key: StorageKey): string | undefined {
  if (typeof window === 'undefined') return;

  return window.localStorage.getItem(envKey(key)) ?? undefined;
}

function envKey(key: StorageKey): string {
  return `vertexvis:${Env}:${StorageKey[key]}`;
}
