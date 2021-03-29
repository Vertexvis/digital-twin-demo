import { Env } from './env';

export const ClientId = 'clientId';

export const StreamKey = 'streamKey';

export function getClientId(): string {
  return getItem(ClientId) ?? '';
}

export function getStreamKey(): string {
  return getItem(StreamKey) ?? '';
}

export function setItem(key: string, value: string): void {
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
