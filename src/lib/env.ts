import { Environment } from "@vertexvis/viewer";

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

// Wind turbine
export const DefaultCredentials: StreamCredentials = {
  clientId: "E2F881AB3228058F9F974AF9BD65A28B200E4645B6D07A293196AC710373129E",
  streamKey: "e0u7BzukDQPZMubBE4cImSx9ESjYJ5rwmGGa",
};

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";

export function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
