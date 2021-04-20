import { Env } from "./env";

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

const CredsKey = "credentials";

export function getStoredCreds(): StreamCredentials {
  const val = getItem(CredsKey);
  const fallback = { clientId: "", streamKey: "" };
  return val ? JSON.parse(val) : fallback ?? fallback;
}

export function setStoredCreds(credentials: StreamCredentials): void {
  setItem(CredsKey, JSON.stringify(credentials));
}

function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(envKey(key), value);
}

function getItem(key: string): string | undefined {
  if (typeof window === "undefined") return;

  return window.localStorage.getItem(envKey(key)) ?? undefined;
}

function envKey(key: string): string {
  return `vertexvis:${Env}:${key}`;
}
