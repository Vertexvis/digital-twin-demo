import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { BottomDrawer } from "../components/BottomDrawer";
import { Props as LayoutProps } from "../components/Layout";
import { LeftDrawer, Options } from "../components/LeftDrawer";
import { encodeCreds, OpenButton, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { DefaultClientId, DefaultStreamKey, Env } from "../lib/env";
import { useKeyListener } from "../lib/key-listener";
import { Properties, toProperties } from "../lib/metadata";
import { flyToSuppliedId } from "../lib/scene-camera";
import {
  applyGroupsBySuppliedIds,
  applyAndShowBySuppliedIds,
  selectByHit,
  showAndClearAll,
  hideBySuppliedId,
} from "../lib/scene-items";
import {
  getStoredCreds,
  setStoredCreds,
  StreamCredentials,
} from "../lib/storage";
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
} from "../lib/time-series";
import { useViewer } from "../lib/viewer";

const Layout = dynamic<LayoutProps>(
  () => import("../components/Layout").then((m) => m.Layout),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const [credentials, setCredentials] = React.useState<StreamCredentials>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });

  React.useEffect(() => {
    router.push(encodeCreds(credentials));
    setStoredCreds(credentials);
    const sensorsToIds = sensorsToItemSuppliedIds(credentials.streamKey);
    setTimeSeriesData(getTimeSeriesData(data, sensorsToIds));
  }, [credentials]);

  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [keys]);

  const viewer = useViewer();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState<Options>(undefined);
  const [timeSeriesData, setTimeSeriesData] = React.useState<TimeSeriesData>({
    ids: [],
    sensors: {},
    sensorsMeta: [],
    sensorsToIds: {},
  });
  const [selectedTs, setSelectedTs] = React.useState("");
  const [selectedSensor, setSelectedSensor] = React.useState("");
  const [displayedSensors, setDisplayedSensors] = React.useState<Set<string>>(
    new Set()
  );
  const [selectedAsset, setSelectedAsset] = React.useState(Assets[0]);
  const [data, setData] = React.useState<RawSensors>(getData(selectedAsset));
  const [properties, setProperties] = React.useState<Properties>({});
  const ready = credentials.clientId && credentials.streamKey && viewer.isReady;

  React.useEffect(() => {
    const tsd = timeSeriesData;
    setSelectedTs(
      tsd.sensors[tsd.ids[0]] ? tsd.sensors[tsd.ids[0]].data[0].timestamp : ""
    );
    setSelectedSensor(tsd.sensorsMeta[0] ? tsd.sensorsMeta[0].id : "");
  }, [timeSeriesData]);

  async function applyAndShowOrHideBySensorId(
    id: string,
    apply: boolean,
    all: boolean
  ): Promise<void> {
    const selectedMeta = timeSeriesData.sensors[id].meta;
    const color = selectedMeta.tsData[selectedTs].color;
    const suppliedIds = selectedMeta.itemSuppliedIds;

    await (apply
      ? applyAndShowBySuppliedIds({
          all,
          group: { color, suppliedIds },
          viewer: viewer.ref.current,
        })
      : hideBySuppliedId({ suppliedIds, viewer: viewer.ref.current }));
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
      viewer: viewer.ref.current,
    });
  }

  async function reset(): Promise<void> {
    setDisplayedSensors(new Set());
    await showAndClearAll({ viewer: viewer.ref.current });
  }

  return (
    <Layout
      bottomDrawer={
        <BottomDrawer
          onSelect={async (timestamp) => updateTimestamp(timestamp)}
          panel={panelOpen}
          sensor={timeSeriesData.sensors[selectedSensor]}
          timestamp={selectedTs}
        />
      }
      header={<OpenButton onClick={() => setDialogOpen(true)} />}
      leftDrawer={<LeftDrawer isOpen={panelOpen} onSelected={setPanelOpen} />}
      main={
        ready && (
          <Viewer
            configEnv={Env}
            credentials={credentials}
            onSceneReady={() => viewer.onSceneReady()}
            onSelect={async (hit) => {
              setProperties(toProperties({ hit }));
              return await selectByHit({ hit, viewer: viewer.ref.current });
            }}
            streamAttributes={{
              experimentalGhosting: {
                enabled: { value: true },
                opacity: { value: 0.7 },
              },
            }}
            viewer={viewer.ref}
          />
        )
      }
      rightDrawer={
        <RightDrawer
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
          properties={properties}
          selectedTs={selectedTs}
          sensors={{
            displayed: displayedSensors,
            list: timeSeriesData.sensorsMeta,
            mapping: timeSeriesData.sensorsToIds,
            onCheck: async (id: string, checked: boolean) => {
              const upd = new Set(displayedSensors);
              checked ? upd.add(id) : upd.delete(id);
              setDisplayedSensors(upd);

              if (upd.size === 0)
                await showAndClearAll({ viewer: viewer.ref.current });
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
              if (displayedSensors.has(id) && keys.alt) {
                flyToSuppliedId({
                  suppliedId:
                    timeSeriesData.sensors[id].meta.itemSuppliedIds[0],
                  viewer: viewer.ref.current,
                });
              }
            },
            selected: selectedSensor,
          }}
        />
      }
    >
      {dialogOpen && (
        <OpenDialog
          credentials={credentials}
          onClose={() => {
            reset();
            setDialogOpen(false);
          }}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
          open={dialogOpen}
        />
      )}
    </Layout>
  );
}
