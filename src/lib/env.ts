import type { Environment } from "@vertexvis/viewer";

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

// Wind turbine
export const DefaultCredentials: StreamCredentials = {
  clientId: "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA",
  streamKey: "iMO9-NngP3tc3HLdvfn4MdKSmgg33QqpDbgX",
};

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";

export function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
