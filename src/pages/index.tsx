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
  applyAndShowBySuppliedIds,
  selectByHit,
  showAndClearAll,
  hideBySuppliedId,
} from '../lib/scene-items';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
import { useViewer } from '../lib/viewer';
import {
  Asset,
  Assets,
  Faults,
  getData,
  getTimeSeriesData,
  RawSensors,
  sensorsToItemSuppliedIds,
  SensorsToItemSuppliedIds,
  TimeSeriesData,
} from '../lib/time-series';
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
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData>({
    ids: [],
    sensors: {},
    sensorsMeta: [],
    sensorsToIds: {},
  });
  const [selectedTs, setSelectedTs] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('');
  const [displayedSensors, setDisplayedSensors] = useState<Set<string>>(
    new Set()
  );
  const [selectedAsset, setSelectedAsset] = useState(Assets[0]);
  const [data, setData] = useState<RawSensors>(getData(selectedAsset));
  const [itemProperties, setItemProperties] = useState<Properties>({});
  const [altDown, setAltDown] = useState(false);

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
    const sensorsToIds = sensorsToItemSuppliedIds(creds.streamKey);
    setTimeSeriesData(getTimeSeriesData(data, sensorsToIds));
  }, [creds]);

  useEffect(() => {
    const tsd = timeSeriesData;
    setSelectedTs(
      tsd.sensors[tsd.ids[0]] ? tsd.sensors[tsd.ids[0]].data[0].timestamp : ''
    );
    setSelectedSensor(tsd.sensorsMeta[0] ? tsd.sensorsMeta[0].id : '');
  }, [timeSeriesData]);

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

  async function applyAndShowOrHideBySensorId(
    id: string,
    apply: boolean,
    all: boolean
  ): Promise<void> {
    const selectedMeta = timeSeriesData.sensors[id].meta;
    const color = selectedMeta.tsData[selectedTs].color;
    const scene = await viewerCtx.viewer.current?.scene();
    const suppliedIds = selectedMeta.itemSuppliedIds;

    await (apply
      ? applyAndShowBySuppliedIds({
          all,
          group: { color, suppliedIds },
          scene,
        })
      : hideBySuppliedId({ scene, suppliedIds }));
  }

  async function updateTimestamp(timestamp: string): Promise<void> {
    await colorSelectedSensors(timestamp);
    setSelectedTs(timestamp);
  }

  async function colorSelectedSensors(timestamp: string): Promise<void> {
    if (displayedSensors.size === 0) return;

    await applyGroupsBySuppliedIds({
      apply: true,
      groups: [...displayedSensors].map((sId) => {
        const selectedMeta = timeSeriesData.sensors[sId].meta;
        return {
          color: selectedMeta.tsData[timestamp].color,
          suppliedIds: selectedMeta.itemSuppliedIds,
        };
      }),
      scene: await viewerCtx.viewer.current?.scene(),
    });
  }

  async function reset(): Promise<void> {
    setDisplayedSensors(new Set());
    await showAndClearAll({ scene: await viewerCtx.viewer.current?.scene() });
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
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full overflow-x-hidden">
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
            list: Assets,
            onSelect: async (asset: Asset) => {
              await reset();
              setSelectedAsset(asset);
              const d = getData(asset);
              setData(d);
              setTimeSeriesData(
                getTimeSeriesData(d, timeSeriesData.sensorsToIds)
              );
            },
            selected: selectedAsset,
          }}
          faults={{
            list: Faults,
            selected: selectedTs,
            onSelect: async (timestamp) => updateTimestamp(timestamp),
          }}
          itemProperties={itemProperties}
          selectedTs={selectedTs}
          sensors={{
            displayed: displayedSensors,
            list: timeSeriesData.sensorsMeta,
            mapping: timeSeriesData.sensorsToIds,
            onCheck: async (id: string, checked: boolean) => {
              const scene = await viewerCtx.viewer.current?.scene();
              const upd = new Set(displayedSensors);
              checked ? upd.add(id) : upd.delete(id);
              setDisplayedSensors(upd);

              if (upd.size === 0) await showAndClearAll({ scene });
              else {
                await applyAndShowOrHideBySensorId(
                  id,
                  checked,
                  displayedSensors.size === 0 && upd.size === 1
                );
              }
            },
            onMappingChange: async (mapping: SensorsToItemSuppliedIds) => {
              await reset();
              setTimeSeriesData(getTimeSeriesData(data, mapping));
            },
            onSelect: async (id) => {
              setSelectedSensor(id);
              if (displayedSensors.has(id) && altDown) {
                flyToSuppliedId({
                  scene: await viewerCtx.viewer.current?.scene(),
                  suppliedId:
                    timeSeriesData.sensors[id].meta.itemSuppliedIds[0],
                });
              }
            },
            selected: selectedSensor,
          }}
        />
        {panelOpen === 'data' && (
          <Panel position={'bottom'}>
            <div className="w-full h-full overflow-x-hidden">
              <DataSheet
                onSelect={async (timestamp) => updateTimestamp(timestamp)}
                sensor={timeSeriesData.sensors[selectedSensor]}
                timestamp={selectedTs}
              />
            </div>
          </Panel>
        )}
        {panelOpen === 'chart' && (
          <Panel position={'bottom'} overflow={'visible'}>
            <div className="w-full h-full">
              <Chart sensor={timeSeriesData.sensors[selectedSensor]} />
            </div>
          </Panel>
        )}
      </div>
      {dialogOpen && (
        <StreamCredsDialog
          creds={creds}
          open={dialogOpen}
          onClose={() => {
            reset();
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
