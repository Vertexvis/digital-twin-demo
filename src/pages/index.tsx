import { useRouter } from "next/router";
import React from "react";
import { BottomDrawer, Content } from "../components/BottomDrawer";
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { LeftDrawer } from "../components/LeftDrawer";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { DefaultCredentials, Env, head, StreamCredentials } from "../lib/env";
import { useKeyListener } from "../lib/key-listener";
import { Properties, toProperties } from "../lib/metadata";
import { flyToSuppliedId } from "../lib/scene-camera";
import {
  applyAndShowBySuppliedIds,
  applyGroupsBySuppliedIds,
  hideBySuppliedId,
  selectByHit,
  showAndClearAll,
} from "../lib/scene-items";
import {
  Asset,
  Assets,
  getData,
  getTimeSeriesData,
  RawSensors,
  SensorsToItemSuppliedIds,
  sensorsToItemSuppliedIds,
  TimeSeriesData,
} from "../lib/time-series";
import { useViewer } from "../lib/viewer";

export default function Home(): JSX.Element {
  const keys = useKeyListener();
  const router = useRouter();
  const viewer = useViewer();

  const [asset, setAsset] = React.useState(Assets[0]);
  const [content, setContent] = React.useState<Content>(undefined);
  const [credentials, setCredentials] =
    React.useState<StreamCredentials | undefined>();
  const [data, setData] = React.useState<RawSensors>(getData(asset));
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [properties, setProperties] = React.useState<Properties>({});
  const [timeSeriesData, setTimeSeriesData] = React.useState<TimeSeriesData>({
    ids: [],
    sensors: {},
    sensorsMeta: [],
  });
  const [ts, setTs] = React.useState("");
  const [sensor, setSensor] = React.useState("");
  const [sensorMapping, setSensorMapping] = React.useState({});
  const [shownSensors, setShownSensors] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [dialogOpen, keys]);

  React.useEffect(() => {
    if (!router.isReady) return;

    setCredentials({
      clientId: head(router.query.clientId) || DefaultCredentials.clientId,
      streamKey: head(router.query.streamKey) || DefaultCredentials.streamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  React.useEffect(() => {
    if (!credentials) return;

    router.push(encodeCreds(credentials));
    setSensorMapping(sensorsToItemSuppliedIds(credentials.streamKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  React.useEffect(() => {
    setTimeSeriesData(getTimeSeriesData(data, sensorMapping));
  }, [data, sensorMapping]);

  React.useEffect(() => {
    const tsd = timeSeriesData;
    setTs(
      tsd.sensors[tsd.ids[0]] ? tsd.sensors[tsd.ids[0]].data[0].timestamp : ""
    );
    setSensor(tsd.sensorsMeta[0] ? tsd.sensorsMeta[0].id : "");
  }, [timeSeriesData]);

  async function applyAndShowOrHideBySensorId(
    id: string,
    apply: boolean,
    all: boolean
  ): Promise<void> {
    const meta = timeSeriesData.sensors[id].meta;
    const color = meta.tsData[ts].color;
    const suppliedIds = meta.itemSuppliedIds;

    await (apply
      ? applyAndShowBySuppliedIds({
          all,
          group: { color, suppliedIds },
          viewer: viewer.ref.current,
        })
      : hideBySuppliedId({ suppliedIds, viewer: viewer.ref.current }));
  }

  async function updateTimestamp(timestamp: string): Promise<void> {
    await colorSensors(timestamp);
    setTs(timestamp);
  }

  async function colorSensors(timestamp: string): Promise<void> {
    if (shownSensors.size === 0) return;

    await applyGroupsBySuppliedIds({
      apply: true,
      groups: [...shownSensors].map((sId) => {
        const meta = timeSeriesData.sensors[sId].meta;
        return {
          color: meta.tsData[timestamp].color,
          suppliedIds: meta.itemSuppliedIds,
        };
      }),
      viewer: viewer.ref.current,
    });
  }

  async function reset(): Promise<void> {
    setShownSensors(new Set());
    await showAndClearAll({ viewer: viewer.ref.current });
  }

  return router.isReady && credentials ? (
    <Layout
      bottomDrawer={
        <BottomDrawer
          onSelect={async (timestamp) => updateTimestamp(timestamp)}
          content={content}
          sensor={timeSeriesData.sensors[sensor]}
          timestamp={ts}
        />
      }
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      leftDrawer={
        <LeftDrawer selected={content} onSelect={(c) => setContent(c)} />
      }
      main={
        viewer.isReady && (
          <Viewer
            configEnv={Env}
            credentials={credentials}
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
            onSelect: async (a: Asset) => {
              await reset();
              setAsset(a);
              const d = getData(a);
              setData(d);
              setTimeSeriesData(getTimeSeriesData(d, sensorMapping));
            },
            selected: asset,
          }}
          faults={{
            selected: ts,
            onSelect: async (timestamp) => updateTimestamp(timestamp),
          }}
          mapping={{
            mapping: sensorMapping,
            onChange: async (mapping: SensorsToItemSuppliedIds) => {
              await reset();
              setSensorMapping(mapping);
              setTimeSeriesData(getTimeSeriesData(data, mapping));
            },
          }}
          metadata={{ properties }}
          sensors={{
            shown: shownSensors,
            list: timeSeriesData.sensorsMeta,
            onCheck: async (id: string, checked: boolean) => {
              const upd = new Set(shownSensors);
              checked ? upd.add(id) : upd.delete(id);
              setShownSensors(upd);

              if (upd.size === 0)
                await showAndClearAll({ viewer: viewer.ref.current });
              else {
                await applyAndShowOrHideBySensorId(
                  id,
                  checked,
                  shownSensors.size === 0 && upd.size === 1
                );
              }
            },
            onSelect: async (id) => {
              setSensor(id);
              if (shownSensors.has(id) && keys.alt) {
                flyToSuppliedId({
                  suppliedId:
                    timeSeriesData.sensors[id].meta.itemSuppliedIds[0],
                  viewer: viewer.ref.current,
                });
              }
            },
            selected: sensor,
            selectedTs: ts,
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
  ) : (
    <></>
  );
}
