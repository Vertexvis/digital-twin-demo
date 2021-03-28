import { vertexvis } from '@vertexvis/frame-streaming-protos';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { LoadStreamKeyDialog } from '../components/LoadStreamKeyDialog';
import { Sidebar } from '../components/Sidebar';
import { VertexLogo } from '../components/VertexLogo';
import { onTap, Viewer } from '../components/Viewer';
import { selectById } from '../lib/alterations';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getClientId, getStreamKey, setItem, StorageKey } from '../lib/storage';
import { useViewer } from '../lib/viewer';

const MonoscopicViewer = onTap(Viewer);
const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const [storedId, storedKey] = [getClientId(), getStreamKey()];

  const [clientId, setClientId] = useState(queryId?.toString() || storedId);
  const [streamKey, setStreamKey] = useState(queryKey?.toString() || storedKey);
  const [dialogOpen, setDialogOpen] = useState(!clientId || !streamKey);
  const viewerCtx = useViewer();

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        clientId
      )}&streamKey=${encodeURIComponent(streamKey)}`
    );
    setItem(StorageKey.ClientId, clientId);
    setItem(StorageKey.StreamKey, streamKey);
  }, [clientId, streamKey]);

  return (
    <Layout title="Vertex Time Series Demo">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
          <div className="ml-4 mr-auto">
            <button
              className="btn btn-primary text-sm"
              onClick={() => setDialogOpen(true)}
            >
              Open Scene
            </button>
          </div>
        </Header>
      </div>
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        {dialogOpen && (
          <LoadStreamKeyDialog
            clientId={clientId}
            streamKey={streamKey}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={(clientId, streamKey) => {
              setClientId(clientId);
              setStreamKey(streamKey);
              setDialogOpen(false);
            }}
          />
        )}
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
            <MonoscopicViewer
              configEnv={Env}
              clientId={clientId}
              streamKey={streamKey}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit?: vertexvis.protobuf.stream.IHit) => {
                const scene = await viewerCtx.viewer.current?.scene();
                if (scene == null) return;

                await selectById(scene, hit?.itemId?.hex ?? '');
              }}
            />
          </div>
        )}
        <Sidebar />
      </div>
    </Layout>
  );
}

export default waitForHydrate(Home);
