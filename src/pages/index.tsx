/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { BottomDrawer } from "../components/BottomDrawer";
import { Header } from "../components/Header";
import { Props as LayoutProps } from "../components/Layout";
import { LeftDrawer } from "../components/LeftDrawer";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { Env } from "../lib/env";
import { toProperties } from "../lib/metadata";
import {
  applyGroupsBySuppliedIds,
  selectByHit,
  showAndClearAll,
} from "../lib/scene-items";
import {
  shownSensorsState,
  metadataPropertiesState,
  openSceneDialogOpenState,
  assetState,
  sensorState,
  timestampState,
  credentialsState,
  timeSeriesDataState,
  sensorMappingState,
} from "../lib/state";
import {
  getData,
  getTimeSeriesData,
  sensorsToItemSuppliedIds,
} from "../lib/time-series";
import { useViewer } from "../lib/viewer";

const Layout = dynamic<LayoutProps>(
  () => import("../components/Layout").then((m) => m.Layout),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();

  const dialogOpen = useRecoilValue(openSceneDialogOpenState);
  const asset = useRecoilValue(assetState);
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
  }, [asset, sensorMapping]);

  React.useEffect(() => {
    colorSensors(timestamp);
  }, [timestamp]);

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
      header={<Header />}
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
      rightDrawer={<RightDrawer viewer={viewer.ref.current} />}
    >
      {dialogOpen && <OpenDialog />}
    </Layout>
  );
}

function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
