import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DataSheet } from '../components/DataSheet';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { StreamCredsDialog } from '../components/StreamCredsDialog';
import { Panel } from '../components/Panel';
import { RightSidebar } from '../components/RightSidebar';
import { LeftSidebar, Options } from '../components/LeftSidebar';
import { VertexLogo } from '../components/VertexLogo';
import { onTap, Viewer } from '../components/Viewer';
import {
  applyGroupsBySuppliedIds,
  applyAndShowOrHideBySuppliedIds,
  selectByHit,
  hideAll,
  showAll,
} from '../lib/scene-items';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
import { useViewer } from '../lib/viewer';
import { getSensors } from '../lib/time-series';
import { flyToSuppliedId } from '../lib/scene-camera';
import { Properties, toProperties } from '../lib/metadata';
import { Chart } from '../components/Chart';

const MonoscopicViewer = onTap(Viewer);
const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const storedCreds = getStoredCreds();
  const assets = ['Hubble', 'James Webb', 'Kepler'];
  const { sensors, sensorIds } = getSensors();
  const sensorsMeta = sensorIds.map((id) => sensors[id].meta);
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
  const [panelOpen, setPanelOpen] = useState<Options | undefined>(undefined);
  const [selectedTs, setSelectedTs] = useState(
    sensors[sensorIds[0]].data[0].timestamp
  );
  const [selectedSensor, setSelectedSensor] = useState(sensorsMeta[0].sensorId);
  const [displayedSensors, setDisplayedSensors] = useState<Set<string>>(
    new Set()
  );
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [itemProperties, setItemProperties] = useState<Properties>({});
  const [altDown, setAltDown] = useState(false);

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
  }, [creds]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return function cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  function handleKeyDown(event: KeyboardEvent): void {
    setAltDown(event.altKey);
  }

  function handleKeyUp(): void {
    setAltDown(false);
  }

  // TODO
  // Fault codes alerts in sidebar, clicking goes to timestamp
  async function applyAndShowOrHideBySensorId(
    sensorId: string,
    apply: boolean
  ): Promise<void> {
    const selectedMeta = sensors[sensorId].meta;
    await applyAndShowOrHideBySuppliedIds({
      apply,
      group: {
        color: selectedMeta.tsData[selectedTs].color,
        suppliedIds: selectedMeta.itemSuppliedIds,
      },
      scene: await viewerCtx.viewer.current?.scene(),
    });
  }

  async function colorSelectedSensors(timestamp: string): Promise<void> {
    if (displayedSensors.size === 0) return;

    await applyGroupsBySuppliedIds({
      apply: true,
      groups: [...displayedSensors].map((sId) => {
        const selectedMeta = sensors[sId].meta;
        return {
          color: selectedMeta.tsData[timestamp].color,
          suppliedIds: selectedMeta.itemSuppliedIds,
        };
      }),
      scene: await viewerCtx.viewer.current?.scene(),
    });
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
        <LeftSidebar isOpen={panelOpen} onSelected={setPanelOpen} />
      </div>
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div className="w-0 flex-grow ml-auto relative">
            <MonoscopicViewer
              configEnv={Env}
              creds={creds}
              viewer={viewerCtx.viewer}
              onSceneReady={() => viewerCtx.onSceneReady()}
              onSelect={async (hit) => {
                const md = hit?.metadata;
                setItemProperties(md ? toProperties({ metadata: md }) : {});
                return await selectByHit({
                  hit,
                  scene: await viewerCtx.viewer.current?.scene(),
                });
              }}
              streamAttributes={{
                experimentalGhosting: {
                  enabled: { value: true },
                  opacity: { value: 0.7 },
                },
              }}
            />
          </div>
        )}
        <RightSidebar
          assets={{
            list: assets,
            onSelect: async (asset: string) => setSelectedAsset(asset),
            selected: selectedAsset,
          }}
          itemProperties={itemProperties}
          selectedTs={selectedTs}
          sensors={{
            displayed: displayedSensors,
            list: sensorsMeta,
            onCheck: async (sensorId: string, checked: boolean) => {
              const scene = await viewerCtx.viewer.current?.scene();
              const upd = new Set(displayedSensors);

              checked ? upd.add(sensorId) : upd.delete(sensorId);
              setDisplayedSensors(upd);

              if (displayedSensors.size === 0 && upd.size === 1) {
                await hideAll({ scene });
              } else if (upd.size === 0) await showAll({ scene });
              await applyAndShowOrHideBySensorId(sensorId, checked);
            },
            onSelect: async (sensorId) => {
              setSelectedSensor(sensorId);
              if (displayedSensors.has(sensorId) && altDown) {
                flyToSuppliedId({
                  scene: await viewerCtx.viewer.current?.scene(),
                  suppliedId: sensors[sensorId].meta.itemSuppliedIds[0],
                });
              }
            },
            selected: selectedSensor,
          }}
        />
        {panelOpen === 'data' && (
          <Panel position={'bottom'}>
            <div className="w-full h-full">
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
        {panelOpen === 'chart' && (
          <Panel position={'bottom'} overflow={'visible'}>
            <div className="w-full h-full">
              <Chart sensor={sensors[selectedSensor]} />
            </div>
          </Panel>
        )}
      </div>
      {dialogOpen && (
        <StreamCredsDialog
          creds={creds}
          open={dialogOpen}
          onClose={() => {
            setDisplayedSensors(new Set());
            setDialogOpen(false);
          }}
          onConfirm={(cs) => {
            setCreds(cs);
            setDialogOpen(false);
          }}
        />
      )}
    </Layout>
  );
}

export default waitForHydrate(Home);
