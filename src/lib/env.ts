import { Environment } from '@vertexvis/viewer';

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || 'platprod';
