/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { BottomDrawer } from "../components/BottomDrawer";
import { Props as LayoutProps } from "../components/Layout";
import { LeftDrawer } from "../components/LeftDrawer";
import { encodeCreds, OpenButton, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { Env } from "../lib/env";
import { useKeyListener } from "../lib/key-listener";
import { toProperties } from "../lib/metadata";
import { flyToSuppliedId } from "../lib/scene-camera";
import {
  applyGroupsBySuppliedIds,
  applyAndShowBySuppliedIds,
  selectByHit,
  showAndClearAll,
  hideBySuppliedId,
} from "../lib/scene-items";
import {
  shownSensorsState,
  head,
  metadataPropertiesState,
  openSceneDialogOpenState,
  assetState,
  sensorState,
  timestampState,
  sensorDataState,
  credentialsState,
  timeSeriesDataState,
  sensorMappingState,
} from "../lib/state";
import {
  getData,
  getTimeSeriesData,
  RawSensors,
  sensorsToItemSuppliedIds,
  SensorsToItemSuppliedIds,
} from "../lib/time-series";
import { useViewer } from "../lib/viewer";

const Layout = dynamic<LayoutProps>(
  () => import("../components/Layout").then((m) => m.Layout),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const keys = useKeyListener();
  const router = useRouter();
  const viewer = useViewer();

  const dialogOpen = useRecoilValue(openSceneDialogOpenState);
  const asset = useRecoilValue(assetState);
  const sensorData = useRecoilValue(sensorDataState);
  const setProperties = useSetRecoilState(metadataPropertiesState);

  const [credentials, setCredentials] = useRecoilState(credentialsState);
  const [sensorMapping, setSensorMapping] = useRecoilState(sensorMappingState);
  const [timeSeriesData, setTimeSeriesData] = useRecoilState(
    timeSeriesDataState
  );
  const [timestamp, setTimestamp] = useRecoilState(timestampState);
  const [sensor, setSensor] = useRecoilState(sensorState);
  const [shownSensors, setShownSensors] = useRecoilState(shownSensorsState);

  const ready = credentials.clientId && credentials.streamKey && viewer.isReady;

  React.useEffect(() => {
    if (router.query.clientId || router.query.streamKey) {
      setCredentials({
        clientId: head(router.query.clientId) ?? credentials.clientId,
        streamKey: head(router.query.streamKey) ?? credentials.streamKey,
      });
    }
  }, [router.isReady]);

  React.useEffect(() => {
    router.push(encodeCreds(credentials));
    setSensorMapping(sensorsToItemSuppliedIds(credentials.streamKey));
  }, [credentials]);

  React.useEffect(() => {
    const tsd = timeSeriesData;
    setTimestamp(
      tsd.sensors[tsd.ids[0]] ? tsd.sensors[tsd.ids[0]].data[0].timestamp : ""
    );
    setSensor(tsd.sensorsMeta[0] ? tsd.sensorsMeta[0].id : "");
  }, [timeSeriesData]);

  React.useEffect(() => {
    reset();
    setTimeSeriesData(getTimeSeriesData(getData(asset), sensorMapping));
  }, [asset]);

  React.useEffect(() => {
    reset();
    setTimeSeriesData(getTimeSeriesData(sensorData, sensorMapping));
  }, [sensorMapping]);

  React.useEffect(() => {
    colorSensors(timestamp);
  }, [timestamp]);

  async function applyAndShowOrHideBySensorId(
    id: string,
    apply: boolean,
    all: boolean
  ): Promise<void> {
    const meta = timeSeriesData.sensors[id].meta;
    const color = meta.tsData[timestamp].color;
    const suppliedIds = meta.itemSuppliedIds;

    await (apply
      ? applyAndShowBySuppliedIds({
          all,
          group: { color, suppliedIds },
          viewer: viewer.ref.current,
        })
      : hideBySuppliedId({ suppliedIds, viewer: viewer.ref.current }));
  }

  async function colorSensors(ts: string): Promise<void> {
    if (shownSensors.size === 0) return;

    await applyGroupsBySuppliedIds({
      apply: true,
      groups: [...shownSensors].map((sId) => {
        const meta = timeSeriesData.sensors[sId].meta;
        return {
          color: meta.tsData[ts].color,
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

  return (
    <Layout
      bottomDrawer={<BottomDrawer sensor={timeSeriesData.sensors[sensor]} />}
      header={<OpenButton />}
      leftDrawer={<LeftDrawer />}
      main={
        ready && (
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
          onCheck={async (id: string, checked: boolean) => {
            const upd = new Set(shownSensors);
            checked ? upd.add(id) : upd.delete(id);
            setShownSensors(upd);

            if (upd.size === 0) {
              await showAndClearAll({ viewer: viewer.ref.current });
            } else {
              await applyAndShowOrHideBySensorId(
                id,
                checked,
                shownSensors.size === 0 && upd.size === 1
              );
            }
          }}
          onSelect={async (id) => {
            setSensor(id);
            if (shownSensors.has(id) && keys.alt) {
              flyToSuppliedId({
                suppliedId: timeSeriesData.sensors[id].meta.itemSuppliedIds[0],
                viewer: viewer.ref.current,
              });
            }
          }}
          selected={sensor}
          shown={shownSensors}
        />
      }
    >
      {dialogOpen && <OpenDialog />}
    </Layout>
  );
}
