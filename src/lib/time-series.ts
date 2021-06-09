import { calcRedToGreenGradient } from "./colors";
import N29961 from "../data/N29961";
import N905NA from "../data/N905NA";
import { DefaultCredentials } from "./env";

export interface TimeSeriesData {
  readonly ids: string[];
  readonly sensors: Sensors;
  readonly sensorsMeta: SensorMeta[];
}

export interface Sensors {
  [key: string]: Sensor;
}

export interface Sensor {
  readonly data: SensorData[];
  readonly meta: SensorMeta;
}

export interface SensorMeta {
  readonly id: string;
  readonly itemSuppliedIds: string[];
  readonly tsData: TsData;
}

interface SensorData {
  readonly avg: number;
  readonly min: number;
  readonly max: number;
  readonly std: number;
  readonly timestamp: string;
}

export interface FaultCode {
  readonly id: string;
  readonly severity: "warn" | "error";
  readonly title: string;
  readonly timestamp: string;
}

export interface SensorsToItemSuppliedIds {
  readonly [id: string]: string[];
}

interface StreamKeyToSensorsToItemSuppliedIds {
  [streamKey: string]: SensorsToItemSuppliedIds;
}

export interface RawSensors {
  [key: string]: RawSensor;
}

interface RawSensor {
  id: string;
  readonly data: SensorData[];
}

interface TsData {
  [timestamp: string]: {
    readonly color: string;
    readonly value: number;
  };
}

export const MinValue = 5;

export const MaxValue = 15;

export type Asset = "N29961" | "N905NA";

export const Assets: Asset[] = ["N29961", "N905NA"];

export const Faults: FaultCode[] = [
  {
    id: "1",
    severity: "warn",
    title: "Check ECU",
    timestamp: "2021-04-01T12:15:01.000Z",
  },
  {
    id: "2",
    severity: "error",
    title: "LCU fault",
    timestamp: "2021-04-01T12:15:07.000Z",
  },
];

const stSk = process.env.NEXT_PUBLIC_ST_STREAM_KEY;
const streamKeyToSensorsToItemSuppliedIds: StreamKeyToSensorsToItemSuppliedIds =
  {
    "U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU": {
      ECU: ["200050"],
      VCU: ["200030", "200060"],
      TCU: ["200090", "200100"],
    },
    [DefaultCredentials.streamKey]: {
      ECU: ["300590", "300060", "306940", "300050", "300590", "300610"],
      VCU: ["326250", "327030", "326260"],
      TCU: ["327980", "327990", "328760"],
      CCU: ["329580", "329590", "330360"],
      RCU: ["304010", "304040"],
      ACU: ["310830", "310840"],
      LCU: ["312840", "312850"],
      SCU: ["309590", "309600"],
    },
  };
if (stSk)
  streamKeyToSensorsToItemSuppliedIds[stSk] = {
    ECU: ["r/216"],
    VCU: ["r/1969", "r/1754", "r/3238"],
    TCU: ["r/589", "r/607", "r/511", "r/573", "r/564"],
    CCU: ["r/3989", "r/6817"],
    RCU: ["r/5467", "r/4891"],
    ACU: ["r/10444"],
    LCU: ["r/10635", "r/1669", "r/6377", "r/2760", "r/5077", "r/2183"],
    SCU: ["r/10798", "r/9986", "r/6204"],
  };

export function sensorsToItemSuppliedIds(
  streamKey: string
): SensorsToItemSuppliedIds {
  return streamKeyToSensorsToItemSuppliedIds[streamKey] ?? {};
}

export function getData(asset: Asset): RawSensors {
  return asset === "N29961" ? N29961 : N905NA;
}

export function getTimeSeriesData(
  data: RawSensors,
  sensorsToIds: SensorsToItemSuppliedIds
): TimeSeriesData {
  function enrich(sensor: RawSensor): Sensor {
    const tsData: TsData = {};

    sensor.data.forEach(
      (d) =>
        (tsData[d.timestamp] = {
          color: calcRedToGreenGradient(
            ((d.avg - MinValue) / (MaxValue - MinValue)) * 100,
            true
          ),
          value: d.avg,
        })
    );

    return {
      data: sensor.data,
      meta: {
        id: sensor.id,
        itemSuppliedIds: sensorsToIds[sensor.id] ?? [],
        tsData,
      },
    };
  }

  const ids = Object.keys(data);
  const enriched: Sensors = {};
  const filteredIds = ids.filter((id) => Boolean(sensorsToIds[id]));
  filteredIds.forEach((id) => (enriched[id] = enrich(data[id])));
  return {
    ids: filteredIds,
    sensors: enriched,
    sensorsMeta: filteredIds.map((id) => enriched[id].meta),
  };
}

export function formatValue(num: number): string {
  return num.toFixed(3);
}
