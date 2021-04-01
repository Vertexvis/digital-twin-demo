import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DataSheet } from '../components/DataSheet';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { StreamCredsDialog } from '../components/StreamCredsDialog';
import { Panel } from '../components/Panel';
import { Sidebar } from '../components/Sidebar';
import { TimeSeriesPanel } from '../components/TimeSeriesPanel';
import { VertexLogo } from '../components/VertexLogo';
import { onTap, Viewer } from '../components/Viewer';
import { applyOrClearBySuppliedId, selectByHit } from '../lib/alterations';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
import { useViewer } from '../lib/viewer';
import { getSensors } from '../lib/time-series';

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
    clientId:
      queryId?.toString() ||
      storedCreds.clientId ||
      '08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA',
    streamKey:
      queryKey?.toString() ||
      storedCreds.streamKey ||
      'U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU',
  });
  const [dialogOpen, setDialogOpen] = useState(
    !creds.clientId || !creds.streamKey
  );
  const [panelOpen, setPanelOpen] = useState(false);

  const { sensors, sensorIds } = getSensors();
  const sensorsMeta = sensorIds.map((id) => sensors[id].meta);
  const [selectedTs, setSelectedTs] = useState(
    sensors[sensorIds[0]].data[0].timestamp
  );
  const [selectedSensor, setSelectedSensor] = useState(sensorsMeta[0].sensorId);
  const [displayedSensors, setDisplayedSenors] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
  }, [creds]);

  async function colorSelectedSensors(timestamp: string): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) return;

    console.log(displayedSensors);
    await Promise.all(
      [...displayedSensors].map(async (sId) => {
        const selectedMeta = sensors[sId].meta;
        return await (selectedMeta.tsData
          ? applyOrClearBySuppliedId({
              apply: true,
              color: selectedMeta.tsData[timestamp].color,
              scene,
              suppliedIds: selectedMeta.itemSuppliedIds ?? [],
            })
          : Promise.resolve());
      })
    );
  }

  async function applyOrClearBySensorId(
    sensorId: string,
    apply: boolean
  ): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) return;

    const selectedMeta = sensors[sensorId].meta;
    return await (selectedMeta.tsData
      ? applyOrClearBySuppliedId({
          apply,
          color: selectedMeta.tsData[selectedTs].color,
          scene,
          suppliedIds: selectedMeta.itemSuppliedIds ?? [],
        })
      : Promise.resolve());
  }

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

                await selectByHit({ hit, scene });
              }}
            />
          </div>
        )}
        <Sidebar
          onCheck={async (sensorId: string, checked: boolean) => {
            checked
              ? displayedSensors.add(sensorId)
              : displayedSensors.delete(sensorId);
            await applyOrClearBySensorId(sensorId, checked);
            setDisplayedSenors(displayedSensors);
          }}
          onSelect={(sensorId) => setSelectedSensor(sensorId)}
          selected={selectedSensor}
          selectedTs={selectedTs}
          sensorsMeta={sensorsMeta}
        />
        {panelOpen && (
          <Panel position={'bottom'}>
            <div className="mx-2 my-1">
              <DataSheet
                onSelect={async (timestamp) => {
                  await colorSelectedSensors(timestamp);
                  setSelectedTs(timestamp);
                }}
                sensor={sensors[selectedSensor]}
                timestamp={selectedTs}
              />
            </div>
          </Panel>
        )}
      </div>
      {dialogOpen && (
        <StreamCredsDialog
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
