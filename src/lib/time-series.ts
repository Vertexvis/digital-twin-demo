import N905NA from "../data/N905NA";
import N29961 from "../data/N29961";
import R8071 from "../data/R8071";
import T03482 from "../data/T03482";
import { calcRedToGreenGradient } from "./colors";
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
  readonly name: string;
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

export type Asset = "N29961" | "N905NA" | "R8071" | "T03482";

export function getAssets(streamKey: string): Asset[] {
  return DefaultCredentials.streamKey === streamKey
    ? ["R8071", "T03482"]
    : ["N29961", "N905NA"];
}

export function getFaults(asset: Asset): FaultCode[] {
  return asset === "T03482"
    ? []
    : [
        {
          id: "1",
          severity: "warn",
          title: "Bearing end-of-life",
          timestamp: isWindTurbine(asset)
            ? "2021-04-03T06:40:00.000Z"
            : "2021-04-01T12:15:01.000Z",
        },
        {
          id: "2",
          severity: "error",
          title: "Brake malfunction",
          timestamp: isWindTurbine(asset)
            ? "2021-04-03T18:20:00.000Z"
            : "2021-04-01T12:15:07.000Z",
        },
      ];
}

function isWindTurbine(asset: Asset): boolean {
  return ["R8071", "T03482"].includes(asset);
}

export const stSk = process.env.NEXT_PUBLIC_ST_STREAM_KEY;
const streamKeyToSensorsToItemSuppliedIds: StreamKeyToSensorsToItemSuppliedIds =
  {
    Eh96kzXEppNfcxj5gbbqdJ9oUdQPB7hXzHrU: {
      ECU: ["200050"],
      VCU: ["200030", "200060"],
      TCU: ["200090", "200100"],
    },
    [DefaultCredentials.streamKey]: {
      gearbox_bearing_01_avg: [
        "300590",
        "300060",
        "306940",
        "300050",
        "300590",
        "300610",
      ], // low-speed shaft
      hub_temp_avg: ["325950", "326040", "325700"], // hub router
      rotor_speed_avg: ["318590", "321750", "320370"], // rotors
      gearbox_bearing_02_avg: ["300620", "300630", "300600"], // intermediate shaft
      gearbox_torque_avg: ["302630"], // brake
      gearbox_speed_avg: [
        "304670",
        "304800",
        "304840",
        "306840",
        "300640",
        "300660",
      ], // high-speed and connector shafts
      generator_speed_avg: ["306540", "306530", "306550"], // generator
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
  switch (asset) {
    case "N29961":
      return N29961;
    case "N905NA":
      return N905NA;
    case "T03482":
      return T03482;
    default:
      return R8071;
  }
}

export function getTimeSeriesData(
  asset: Asset,
  data: RawSensors,
  sensorsToIds: SensorsToItemSuppliedIds
): TimeSeriesData {
  function enrich(id: string, sensor: RawSensor): Sensor {
    const tsData: TsData = {};

    sensor.data.forEach((d) => {
      const val =
        asset === "R8071"
          ? R8071MinMaxValues[id]
          : asset === "T03482"
          ? T03482MinMaxValues[id]
          : undefined;
      const min = val?.min ?? MinValue;
      const max = val?.max ?? MaxValue;
      tsData[d.timestamp] = {
        color: calcRedToGreenGradient(
          ((d.avg - min) / (max - min)) * 100,
          true
        ),
        value: d.avg,
      };
    });

    return {
      data: sensor.data,
      meta: {
        id,
        itemSuppliedIds: sensorsToIds[id] ?? [],
        name: sensor.id,
        tsData,
      },
    };
  }

  const ids = Object.keys(data);
  const enriched: Sensors = {};
  const filteredIds = ids.filter((id) => Boolean(sensorsToIds[id]));
  filteredIds.forEach((id) => (enriched[id] = enrich(id, data[id])));
  const res = {
    ids: filteredIds,
    sensors: enriched,
    sensorsMeta: filteredIds.map((id) => enriched[id].meta),
  };

  return res;
}

export function formatValue(num: number): string {
  return num.toFixed(3);
}

export interface ListItem {
  timestamp: string;
  turbine_id: number;

  hub_temp_avg: number;
  hub_temp_min: number;
  hub_temp_max: number;
  hub_temp_std: number;

  gearbox_bearing_01_avg: number;
  gearbox_bearing_01_min: number;
  gearbox_bearing_01_max: number;
  gearbox_bearing_01_std: number;

  gearbox_bearing_02_avg: number;
  gearbox_bearing_02_min: number;
  gearbox_bearing_02_max: number;
  gearbox_bearing_02_std: number;

  gearbox_speed_avg: number;
  gearbox_speed_min: number;
  gearbox_speed_max: number;
  gearbox_speed_std: number;

  gearbox_torque_avg: number;
  gearbox_torque_min: number;
  gearbox_torque_max: number;
  gearbox_torque_std: number;

  generator_speed_avg: number;
  generator_speed_min: number;
  generator_speed_max: number;
  generator_speed_std: number;

  pitch_angle_avg: number;
  pitch_angle_min: number;
  pitch_angle_max: number;
  pitch_angle_std: number;

  rotor_speed_avg: number;
  rotor_speed_min: number;
  rotor_speed_max: number;
  rotor_speed_std: number;

  rotor_bearing_temp_avg: number;
  rotor_bearing_temp_min: number;
  rotor_bearing_temp_max: number;
  rotor_bearing_temp_std: number;

  wind_speed_avg: number;
  wind_speed_min: number;
  wind_speed_max: number;
  wind_speed_std: number;

  wind_direction_avg: number;
  wind_direction_min: number;
  wind_direction_max: number;
  wind_direction_std: number;
}

export const T03482MinMaxValues: Record<string, { min: number; max: number }> =
  {
    timestamp: { min: 1451743800000, max: 1452108000000 },
    turbine_id: { min: 5246235, max: 5246235 },
    pitch_angle_avg: { min: -0.99000001, max: 45 },
    pitch_angle_min: { min: -1, max: 45 },
    pitch_angle_max: { min: -0.99000001, max: 45 },
    pitch_angle_std: { min: 0, max: 3.73 },
    hub_temp_avg: { min: 6, max: 14.91 },
    hub_temp_min: { min: 6, max: 14 },
    hub_temp_max: { min: 6, max: 15 },
    hub_temp_std: { min: 0, max: 0.44999999 },
    gearbox_speed_avg: { min: 3.4400001, max: 1800.28 },
    gearbox_speed_min: { min: 3.3599999, max: 1778.97 },
    gearbox_speed_max: { min: 3.51, max: 1876.76 },
    gearbox_speed_std: { min: 0.029999999, max: 140.66 },
    gearbox_torque_avg: { min: -8.5100002, max: 9907.0801 },
    gearbox_torque_min: { min: -8.9499998, max: 3868.22 },
    gearbox_torque_max: { min: -8.2299995, max: 11005.3 },
    gearbox_torque_std: { min: 0.1, max: 1823.58 },
    generator_speed_avg: { min: 0.52999997, max: 1799.36 },
    generator_speed_min: { min: -0.61000001, max: 1777.95 },
    generator_speed_max: { min: 15.58, max: 1875.53 },
    generator_speed_std: { min: 0.44, max: 140.73 },
    rotor_speed_avg: { min: 0, max: 17.17 },
    rotor_speed_min: { min: 0, max: 16.959999 },
    rotor_speed_max: { min: 0, max: 17.9 },
    rotor_speed_std: { min: 0, max: 1.35 },
    rotor_bearing_temp_avg: { min: 10, max: 26.280001 },
    rotor_bearing_temp_min: { min: 10, max: 26.200001 },
    rotor_bearing_temp_max: { min: 10, max: 26.299999 },
    rotor_bearing_temp_std: { min: 0, max: 0.14 },
    gearbox_bearing_01_avg: { min: 17.200001, max: 73.330002 },
    gearbox_bearing_01_min: { min: 17.1, max: 72.650002 },
    gearbox_bearing_01_max: { min: 17.4, max: 74 },
    gearbox_bearing_01_std: { min: 0.1, max: 1.29 },
    gearbox_bearing_02_avg: { min: 63.740002, max: 73.809998 },
    gearbox_bearing_02_min: { min: 62.900002, max: 73.5 },
    gearbox_bearing_02_max: { min: 64.800003, max: 74.099998 },
    gearbox_bearing_02_std: { min: 0.07, max: 1.28 },
    wind_speed_avg: { min: 5.04, max: 10.76 },
    wind_speed_min: { min: 3.3, max: 7.0900002 },
    wind_speed_max: { min: 6.4200001, max: 17.09 },
    wind_speed_std: { min: 0.46000001, max: 2.1700001 },
    wind_direction_avg: { min: 168.62, max: 265.03 },
    wind_direction_min: { min: 22.42, max: 220.42999 },
    wind_direction_max: { min: 27.540001, max: 340.75 },
    wind_direction_std: { min: 7.3899999, max: 149.77 },
  };

export const R8071MinMaxValues: Record<string, { min: number; max: number }> = {
  timestamp: { min: 1451743800000, max: 1452108000000 },
  turbine_id: { min: 3021153, max: 3021153 },
  pitch_angle_avg: { min: -0.99000001, max: 0.02 },
  pitch_angle_min: { min: -1, max: 0 },
  pitch_angle_max: { min: -0.99000001, max: 10.32 },
  pitch_angle_std: { min: 0, max: 2.27 },
  hub_temp_avg: { min: 11.95, max: 14 },
  hub_temp_min: { min: 11, max: 14 },
  hub_temp_max: { min: 12, max: 14.18 },
  hub_temp_std: { min: 0, max: 0.44 },
  gearbox_speed_avg: { min: 1091.42, max: 1799.88 },
  gearbox_speed_min: { min: 964.21997, max: 1770.0699 },
  gearbox_speed_max: { min: 1159.48, max: 1870.3 },
  gearbox_speed_std: { min: 10.91, max: 192.17 },
  gearbox_torque_avg: { min: 1383.8, max: 7442.0801 },
  gearbox_torque_min: { min: 477.32001, max: 4100.46 },
  gearbox_torque_max: { min: 1598.02, max: 10967.4 },
  gearbox_torque_std: { min: 109.01, max: 2545.6399 },
  generator_speed_avg: { min: 1090.17, max: 1798.89 },
  generator_speed_min: { min: 962.69, max: 1768.92 },
  generator_speed_max: { min: 1158.29, max: 1869.35 },
  generator_speed_std: { min: 10.91, max: 192.28999 },
  rotor_speed_avg: { min: 10.38, max: 17.17 },
  rotor_speed_min: { min: 9.1599998, max: 16.870001 },
  rotor_speed_max: { min: 11.03, max: 17.84 },
  rotor_speed_std: { min: 0.11, max: 1.84 },
  rotor_bearing_temp_avg: { min: 22.379999, max: 27.01 },
  rotor_bearing_temp_min: { min: 22.200001, max: 27 },
  rotor_bearing_temp_max: { min: 22.5, max: 27.1 },
  rotor_bearing_temp_std: { min: 0, max: 0.1 },
  gearbox_bearing_01_avg: { min: 60.240002, max: 71.669998 },
  gearbox_bearing_01_min: { min: 58.799999, max: 70.900002 },
  gearbox_bearing_01_max: { min: 61.299999, max: 72.400002 },
  gearbox_bearing_01_std: { min: 0.15000001, max: 1.65 },
  gearbox_bearing_02_avg: { min: 63.740002, max: 73.809998 },
  gearbox_bearing_02_min: { min: 62.900002, max: 73.5 },
  gearbox_bearing_02_max: { min: 64.800003, max: 74.099998 },
  gearbox_bearing_02_std: { min: 0.07, max: 1.28 },
  wind_speed_avg: { min: 5.04, max: 10.76 },
  wind_speed_min: { min: 3.3, max: 7.0900002 },
  wind_speed_max: { min: 6.4200001, max: 17.09 },
  wind_speed_std: { min: 0.46000001, max: 2.1700001 },
  wind_direction_avg: { min: 168.62, max: 265.03 },
  wind_direction_min: { min: 22.42, max: 220.42999 },
  wind_direction_max: { min: 27.540001, max: 340.75 },
  wind_direction_std: { min: 7.3899999, max: 149.77 },
};
