import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DataSheet } from '../components/DataSheet';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { LoadStreamKeyDialog } from '../components/LoadStreamKeyDialog';
import { Panel } from '../components/Panel';
import { Sidebar } from '../components/Sidebar';
import { TimeSeriesPanel } from '../components/TimeSeriesPanel';
import { VertexLogo } from '../components/VertexLogo';
import { onTap, Viewer } from '../components/Viewer';
import { selectById } from '../lib/alterations';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds } from '../lib/storage';
import { StreamCreds } from '../lib/types';
import { useViewer } from '../lib/viewer';

const MonoscopicViewer = onTap(Viewer);
const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const storedCreds = getStoredCreds();
  const viewerCtx = useViewer();

  const [creds, setCreds] = useState<StreamCreds>({
    clientId: queryId?.toString() || storedCreds.clientId,
    streamKey: queryKey?.toString() || storedCreds.streamKey,
  });
  const [dialogOpen, setDialogOpen] = useState(
    !creds.clientId || !creds.streamKey
  );
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
  }, [creds]);

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
      <div className="row-start-2 row-span-full col-span-1">
        <TimeSeriesPanel isOpen={panelOpen} onSelected={setPanelOpen} />
      </div>
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div className="w-0 flex-grow ml-auto relative">
            <MonoscopicViewer
              configEnv={Env}
              creds={creds}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit) => {
                const scene = await viewerCtx.viewer.current?.scene();
                if (scene == null) return;

                await selectById(scene, hit?.itemId?.hex ?? '');
              }}
            />
          </div>
        )}
        <Sidebar />
        {panelOpen && (
          <Panel position={'bottom'}>
            <div className="mx-2 my-1">
              <DataSheet
                data={[
                  {
                    timestamp: '2021-01-02T08:50Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 14,
                    temp_max: 14.18,
                    temp_std: 0.0099999998,
                  },
                  {
                    timestamp: '2021-01-02T14:00Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 14,
                    temp_max: 14,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-02T14:30Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 14,
                    temp_max: 14,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-02T15:40Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 14,
                    temp_max: 14,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-02T23:40Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T02:10Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T00:40Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T13:30Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 13.82,
                    temp_max: 14,
                    temp_std: 0.0099999998,
                  },
                  {
                    timestamp: '2021-01-03T04:20Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T05:10Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T07:00Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T19:00Z',
                    sensor_id: '103',
                    temp_avg: 12.7,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.38999999,
                  },
                  {
                    timestamp: '2021-01-03T12:20Z',
                    sensor_id: '103',
                    temp_avg: 13.54,
                    temp_min: 13,
                    temp_max: 14,
                    temp_std: 0.41,
                  },
                  {
                    timestamp: '2021-01-03T12:40Z',
                    sensor_id: '103',
                    temp_avg: 14,
                    temp_min: 14,
                    temp_max: 14,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T22:20Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 12.94,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T14:50Z',
                    sensor_id: '103',
                    temp_avg: 13.1,
                    temp_min: 13,
                    temp_max: 14,
                    temp_std: 0.23,
                  },
                  {
                    timestamp: '2021-01-04T06:40Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T06:50Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-03T16:10Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13.83,
                    temp_std: 0.050000001,
                  },
                  {
                    timestamp: '2021-01-03T20:50Z',
                    sensor_id: '103',
                    temp_avg: 12.29,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.38,
                  },
                  {
                    timestamp: '2021-01-04T16:20Z',
                    sensor_id: '103',
                    temp_avg: 12.58,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.38,
                  },
                  {
                    timestamp: '2021-01-03T23:10Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T02:30Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T21:20Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T06:00Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T08:40Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T09:20Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T10:20Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-05T01:20Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-05T06:30Z',
                    sensor_id: '103',
                    temp_avg: 12.01,
                    temp_min: 12,
                    temp_max: 12.66,
                    temp_std: 0.050000001,
                  },
                  {
                    timestamp: '2021-01-04T12:30Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T13:50Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 13,
                    temp_max: 13,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T20:50Z',
                    sensor_id: '103',
                    temp_avg: 12.03,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.12,
                  },
                  {
                    timestamp: '2021-01-05T15:10Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-04T23:10Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-05T05:00Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-05T06:00Z',
                    sensor_id: '103',
                    temp_avg: 12.03,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.15000001,
                  },
                  {
                    timestamp: '2021-01-05T08:10Z',
                    sensor_id: '103',
                    temp_avg: 12.04,
                    temp_min: 12,
                    temp_max: 12.96,
                    temp_std: 0.15000001,
                  },
                  {
                    timestamp: '2021-01-05T09:20Z',
                    sensor_id: '103',
                    temp_avg: 12.1,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.23999999,
                  },
                  {
                    timestamp: '2021-01-05T13:50Z',
                    sensor_id: '103',
                    temp_avg: 12.53,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.44,
                  },
                  {
                    timestamp: '2021-01-05T15:30Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-05T17:20Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-06T03:10Z',
                    sensor_id: '103',
                    temp_avg: 11.95,
                    temp_min: 11,
                    temp_max: 12,
                    temp_std: 0.15000001,
                  },
                  {
                    timestamp: '2021-01-06T03:30Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-06T04:00Z',
                    sensor_id: '103',
                    temp_avg: 11.99,
                    temp_min: 11,
                    temp_max: 12,
                    temp_std: 0.059999999,
                  },
                  {
                    timestamp: '2021-01-06T05:10Z',
                    sensor_id: '103',
                    temp_avg: 12,
                    temp_min: 12,
                    temp_max: 12,
                    temp_std: 0,
                  },
                  {
                    timestamp: '2021-01-06T12:50Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 12.88,
                    temp_max: 13,
                    temp_std: 0.0099999998,
                  },
                  {
                    timestamp: '2021-01-06T13:20Z',
                    sensor_id: '103',
                    temp_avg: 13,
                    temp_min: 12.7,
                    temp_max: 13,
                    temp_std: 0.0099999998,
                  },
                  {
                    timestamp: '2021-01-02T22:30Z',
                    sensor_id: '103',
                    temp_avg: 13.62,
                    temp_min: 13,
                    temp_max: 14,
                    temp_std: 0.41,
                  },
                  {
                    timestamp: '2021-01-04T21:50Z',
                    sensor_id: '103',
                    temp_avg: 12.06,
                    temp_min: 12,
                    temp_max: 13,
                    temp_std: 0.2,
                  },
                ]}
              />
            </div>
          </Panel>
        )}
      </div>
      {dialogOpen && (
        <LoadStreamKeyDialog
          creds={creds}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(creds) => {
            setCreds(creds);
            setDialogOpen(false);
          }}
        />
      )}
    </Layout>
  );
}

export default waitForHydrate(Home);
