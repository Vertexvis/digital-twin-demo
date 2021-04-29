import { Environment } from "@vertexvis/viewer";

export const DefaultClientId =
  "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA";

// Wind turbine
export const DefaultStreamKey = "UbZCuXV38qGRUxw8gSenvgoTwN4x_QErXMIR";

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";
