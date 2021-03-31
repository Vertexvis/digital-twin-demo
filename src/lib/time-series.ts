import { calcRedToGreenGradient } from './colors';

export interface Sensors {
  [key: string]: Sensor;
}

export interface Sensor {
  readonly data: SensorData[];
  meta: SensorMeta;
}

export interface SensorMeta {
  display?: boolean;
  itemSuppliedIds?: string[];
  tsData?: TsData;
  readonly name: string;
  readonly sensorId: string;
}

export interface SensorData {
  readonly avg: number;
  readonly min: number;
  readonly max: number;
  readonly std: number;
  readonly timestamp: string;
}

interface TsData {
  [timestamp: string]: { color: string; value: number };
}

export const MinValue = 5;

export const MaxValue = 15;

const rawData: Sensors = {
  '1': {
    data: [
      {
        timestamp: '2021-04-01T12:15:00.000Z',
        min: 7.213213100418578,
        max: 12.760251705662101,
        avg: 11.722067460348633,
        std: 0.28070777141243064,
      },
      {
        timestamp: '2021-04-01T12:15:01.000Z',
        min: 13.849547790066614,
        max: 14.630255955417375,
        avg: 14.193816463094485,
        std: 0.2938304718506112,
      },
      {
        timestamp: '2021-04-01T12:15:02.000Z',
        min: 12.876627665093697,
        max: 14.077604304791125,
        avg: 12.991127828334703,
        std: 0.2984843292374585,
      },
      {
        timestamp: '2021-04-01T12:15:03.000Z',
        min: 10.053769358691287,
        max: 13.844430621752817,
        avg: 10.78110442907593,
        std: 0.14558123043953475,
      },
      {
        timestamp: '2021-04-01T12:15:04.000Z',
        min: 12.98422303025327,
        max: 13.332890084176753,
        avg: 13.087715426169686,
        std: 0.4924511079676498,
      },
      {
        timestamp: '2021-04-01T12:15:05.000Z',
        min: 9.332860527603373,
        max: 9.458148461877762,
        avg: 9.414746072015078,
        std: 0.03745929567016937,
      },
      {
        timestamp: '2021-04-01T12:15:06.000Z',
        min: 6.848040349762523,
        max: 9.190178415503853,
        avg: 7.960091145292701,
        std: 0.3173058970026329,
      },
      {
        timestamp: '2021-04-01T12:15:07.000Z',
        min: 9.916535197482936,
        max: 11.795112294833174,
        avg: 11.253989531698792,
        std: 0.3146242075153117,
      },
      {
        timestamp: '2021-04-01T12:15:08.000Z',
        min: 11.749236265091787,
        max: 12.066742907788935,
        avg: 11.994476148401214,
        std: 0.3706758249192119,
      },
      {
        timestamp: '2021-04-01T12:15:09.000Z',
        min: 14.578878345394994,
        max: 14.854234291307492,
        avg: 14.593832272730085,
        std: 0.3252856759491046,
      },
      {
        timestamp: '2021-04-01T12:15:10.000Z',
        min: 5.181067808556632,
        max: 12.178622993522424,
        avg: 8.33338538098496,
        std: 0.12333702901882337,
      },
      {
        timestamp: '2021-04-01T12:15:11.000Z',
        min: 14.151552497397192,
        max: 14.755066710403208,
        avg: 14.59676297223669,
        std: 0.19328066152669476,
      },
      {
        timestamp: '2021-04-01T12:15:12.000Z',
        min: 11.569725824577613,
        max: 13.417358184081076,
        avg: 12.908479537897012,
        std: 0.11602258961091305,
      },
      {
        timestamp: '2021-04-01T12:15:13.000Z',
        min: 5.996170768528448,
        max: 13.668271504860796,
        avg: 9.467653282468756,
        std: 0.34466046688620455,
      },
      {
        timestamp: '2021-04-01T12:15:14.000Z',
        min: 6.465953468098418,
        max: 7.434397373003428,
        avg: 6.72081567763386,
        std: 0.33031856811095106,
      },
    ],
    meta: { name: 'Grand Canyon', sensorId: '1' },
  },
  '2': {
    data: [
      {
        timestamp: '2021-04-01T12:15:00.000Z',
        min: 5.564014782162435,
        max: 9.819234240641231,
        avg: 6.653478077473772,
        std: 0.2199410950768489,
      },
      {
        timestamp: '2021-04-01T12:15:01.000Z',
        min: 12.719956143798449,
        max: 13.770019738621137,
        avg: 13.400280825713065,
        std: 0.4952829586541744,
      },
      {
        timestamp: '2021-04-01T12:15:02.000Z',
        min: 5.577277348177656,
        max: 5.592551600149508,
        avg: 5.58102363355977,
        std: 0.01966793571971226,
      },
      {
        timestamp: '2021-04-01T12:15:03.000Z',
        min: 6.391292918813766,
        max: 11.322569757930193,
        avg: 7.948336471573244,
        std: 0.27109052444254556,
      },
      {
        timestamp: '2021-04-01T12:15:04.000Z',
        min: 14.543357111246005,
        max: 14.827154842451193,
        avg: 14.745599825681024,
        std: 0.06357813113792676,
      },
      {
        timestamp: '2021-04-01T12:15:05.000Z',
        min: 8.680617552503751,
        max: 11.972787711680576,
        avg: 10.431853834990907,
        std: 0.4747921224690195,
      },
      {
        timestamp: '2021-04-01T12:15:06.000Z',
        min: 14.676347433343429,
        max: 14.733321402779119,
        avg: 14.700575540228092,
        std: 0.33209210163689584,
      },
      {
        timestamp: '2021-04-01T12:15:07.000Z',
        min: 10.164393498268785,
        max: 10.294314290855633,
        avg: 10.259829391135629,
        std: 0.056049266450082125,
      },
      {
        timestamp: '2021-04-01T12:15:08.000Z',
        min: 5.921823639212818,
        max: 11.980114422754005,
        avg: 6.68990377757227,
        std: 0.29178453231675794,
      },
      {
        timestamp: '2021-04-01T12:15:09.000Z',
        min: 11.920081396658846,
        max: 12.037588288985337,
        avg: 12.004929273730195,
        std: 0.47570283770819255,
      },
      {
        timestamp: '2021-04-01T12:15:10.000Z',
        min: 10.711953460409704,
        max: 12.135524772934659,
        avg: 11.353772757656186,
        std: 0.33348128505902885,
      },
      {
        timestamp: '2021-04-01T12:15:11.000Z',
        min: 8.391940067522913,
        max: 14.25446912896857,
        avg: 8.546236617807795,
        std: 0.45823103544516486,
      },
      {
        timestamp: '2021-04-01T12:15:12.000Z',
        min: 12.283411428024776,
        max: 12.417514115127958,
        avg: 12.28762969328577,
        std: 0.2864483944204491,
      },
      {
        timestamp: '2021-04-01T12:15:13.000Z',
        min: 8.789111355512688,
        max: 12.832500944874266,
        avg: 9.368415985120807,
        std: 0.32811499526226895,
      },
      {
        timestamp: '2021-04-01T12:15:14.000Z',
        min: 11.116770653849684,
        max: 14.152280422477418,
        avg: 13.24002383436445,
        std: 0.3966181092222558,
      },
    ],
    meta: { name: 'Yosemite', sensorId: '2' },
  },
  '3': {
    data: [
      {
        timestamp: '2021-04-01T12:15:00.000Z',
        min: 11.653700854305471,
        max: 12.292983685818161,
        avg: 11.788907655266813,
        std: 0.4315230758477253,
      },
      {
        timestamp: '2021-04-01T12:15:01.000Z',
        min: 8.397713583819295,
        max: 8.795562643310767,
        avg: 8.483053203980582,
        std: 0.3594186011479724,
      },
      {
        timestamp: '2021-04-01T12:15:02.000Z',
        min: 8.469502472842446,
        max: 13.878993834644456,
        avg: 12.250795778936958,
        std: 0.03937652400527647,
      },
      {
        timestamp: '2021-04-01T12:15:03.000Z',
        min: 10.88411592167628,
        max: 13.77227101116574,
        avg: 12.044837464403676,
        std: 0.094371431754942,
      },
      {
        timestamp: '2021-04-01T12:15:04.000Z',
        min: 12.135252804046662,
        max: 12.290931220894109,
        avg: 12.289605958286936,
        std: 0.1876206733767084,
      },
      {
        timestamp: '2021-04-01T12:15:05.000Z',
        min: 13.883826130487451,
        max: 13.930066221354624,
        avg: 13.900679458971007,
        std: 0.4579721534825686,
      },
      {
        timestamp: '2021-04-01T12:15:06.000Z',
        min: 8.649212021232442,
        max: 14.580751445329767,
        avg: 13.01174674881477,
        std: 0.2732896117353526,
      },
      {
        timestamp: '2021-04-01T12:15:07.000Z',
        min: 5.118357188245013,
        max: 5.399615574057488,
        avg: 5.306539967917441,
        std: 0.48082389547196713,
      },
      {
        timestamp: '2021-04-01T12:15:08.000Z',
        min: 13.54655090567536,
        max: 14.524658613217538,
        avg: 13.763028220039931,
        std: 0.4605340061580815,
      },
      {
        timestamp: '2021-04-01T12:15:09.000Z',
        min: 12.283852589691351,
        max: 14.931359646234768,
        avg: 13.613520526573277,
        std: 0.2852852891713896,
      },
      {
        timestamp: '2021-04-01T12:15:10.000Z',
        min: 10.00039526494334,
        max: 10.435532596774628,
        avg: 10.011301053841873,
        std: 0.1774320180895247,
      },
      {
        timestamp: '2021-04-01T12:15:11.000Z',
        min: 7.7947295979811155,
        max: 14.607406448044326,
        avg: 13.805597824728288,
        std: 0.38945447390635846,
      },
      {
        timestamp: '2021-04-01T12:15:12.000Z',
        min: 14.675230761490907,
        max: 14.766081912077862,
        avg: 14.710796970302528,
        std: 0.09295869157602454,
      },
      {
        timestamp: '2021-04-01T12:15:13.000Z',
        min: 7.912679916462679,
        max: 10.734631358089134,
        avg: 9.967484419527636,
        std: 0.31376537660600057,
      },
      {
        timestamp: '2021-04-01T12:15:14.000Z',
        min: 14.624051957761512,
        max: 14.682682714254357,
        avg: 14.644484976616404,
        std: 0.14217246837670983,
      },
    ],
    meta: { name: 'Grand Teton', sensorId: '3' },
  },
};

const sensorIds = Object.keys(rawData);

const sensorToItemSuppliedId: { [sensorId: string]: string[] } = {
  '1': ['r/5'],
  '2': ['r/3', 'r/6'],
  '3': ['r/9', 'r/10'],
};

export function getSensors(): { sensors: Sensors; sensorIds: string[] } {
  function enrich(sensor: Sensor): Sensor {
    const tsd: TsData = {};
    sensor.data.forEach(
      (d) =>
        (tsd[d.timestamp] = {
          color: calcRedToGreenGradient(
            ((d.avg - MinValue) / (MaxValue - MinValue)) * 100,
            true
          ),
          value: d.avg,
        })
    );
    sensor.meta.tsData = tsd;
    sensor.meta.itemSuppliedIds = sensorToItemSuppliedId[sensor.meta.sensorId];

    return sensor;
  }

  const enriched: Sensors = {};
  sensorIds.map((id) => (enriched[id] = enrich(rawData[id])));
  return { sensors: enriched, sensorIds };
}

export function formatValue(num: number): string {
  return num.toFixed(3);
}
