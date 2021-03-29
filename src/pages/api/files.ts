import { FileList, VertexClient } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList>
): Promise<void> {
  const c = await getClient();
  res.status(200).json((await c.files.getFiles({ pageSize: 5 })).data);
}

let client: VertexClient | undefined;
async function getClient(): Promise<VertexClient> {
  if (client != null) return client;

  const env = process.env.NEXT_PUBLIC_VERTEX_ENV;
  client = await VertexClient.build({
    basePath:
      env === 'platprod' || env === ''
        ? 'https://platform.vertexvis.com'
        : `https://platform.${env}.vertexvis.io`,
    client: {
      id: process.env.VERTEX_CLIENT_ID ?? '',
      secret: process.env.VERTEX_CLIENT_SECRET ?? '',
    },
  });
  return client;
}
