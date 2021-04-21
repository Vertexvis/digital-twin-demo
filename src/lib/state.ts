import { atom, DefaultValue, RecoilState } from "recoil";
import { DefaultClientId, DefaultStreamKey, Env } from "./env";
import { Properties } from "./metadata";
import {
  Assets,
  SensorsToItemSuppliedIds,
  TimeSeriesData,
} from "./time-series";

type Content = "data" | "chart" | undefined;

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

interface Param<T> {
  node: RecoilState<T>;
  trigger: "set" | "get";
  setSelf: (
    param:
      | T
      | DefaultValue
      | Promise<T | DefaultValue>
      | ((param: T | DefaultValue) => T | DefaultValue)
  ) => void;
  resetSelf: () => void;
  onSet: (
    param: (newValue: T | DefaultValue, oldValue: T | DefaultValue) => void
  ) => void;
}

const StorageKeys = {
  credentials: "credentials",
};

const Keys = {
  bottomDrawerContent: "bottomDrawerContent",
  streamCredentials: "streamCredentials",
  shownSensors: "shownSensors",
  metadataProperties: "metadataProperties",
  openSceneDialogOpen: "openSceneDialogOpen",
  asset: "asset",
  sensor: "sensor",
  timestamp: "timestamp",
  sensorMapping: "sensorMapping",
  credentialsState: "credentialsState",
  timeSeriesData: "timeSeriesData",
};

export const bottomDrawerContentState = atom<Content>({
  key: Keys.bottomDrawerContent,
  default: undefined,
});

export const shownSensorsState = atom<Set<string>>({
  key: Keys.shownSensors,
  default: new Set(),
});

export const metadataPropertiesState = atom<Properties>({
  key: Keys.metadataProperties,
  default: {},
});

export const openSceneDialogOpenState = atom({
  key: Keys.openSceneDialogOpen,
  default: false,
});

export const assetState = atom({
  key: Keys.asset,
  default: Assets[0],
});

export const sensorState = atom({
  key: Keys.sensor,
  default: "",
});

export const timestampState = atom({
  key: Keys.timestamp,
  default: "",
});

export const credentialsState = atom<StreamCredentials>({
  key: Keys.streamCredentials,
  default: { clientId: DefaultClientId, streamKey: DefaultStreamKey },
  effects_UNSTABLE: [localStorageEffect(StorageKeys.credentials)],
});

export const timeSeriesDataState = atom<TimeSeriesData>({
  key: Keys.timeSeriesData,
  default: {
    ids: [],
    sensors: {},
    sensorsMeta: [],
  },
});

export const sensorMappingState = atom<SensorsToItemSuppliedIds>({
  key: Keys.sensorMapping,
  default: {},
});

function localStorageEffect<T>(
  key: string
): ({ setSelf, onSet }: Param<T>) => void {
  return ({ setSelf, onSet }: Param<T>): void => {
    const i = getItem(key);
    if (i != null) setSelf(JSON.parse(i));

    onSet((ni) =>
      ni instanceof DefaultValue
        ? removeItem(key)
        : setItem(key, JSON.stringify(ni))
    );
  };
}

function getItem(key: string): string | undefined {
  if (typeof window === "undefined") return;

  return window.localStorage.getItem(envKey(key)) ?? undefined;
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(envKey(key));
}

function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(envKey(key), value);
}

function envKey(key: string): string {
  return `vertexvis:${Env}:${key}`;
}
