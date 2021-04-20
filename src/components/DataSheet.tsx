import cn from 'classnames';
import React from 'react';
import { formatValue, Sensor } from '../lib/time-series';

interface Props {
  readonly onSelect: (timestamp: string) => Promise<void>;
  readonly sensor: Sensor;
  readonly timestamp: string;
}

export function DataSheet({ onSelect, sensor, timestamp }: Props): JSX.Element {
  return (
    <table className="text-right w-full">
      <caption className="text-xl">{sensor.meta.id}</caption>
      <thead className="border-b-2 border-t">
        <tr>
          <th className="px-3 text-left">Timestamp</th>
          <th>Minimum</th>
          <th>Maximum</th>
          <th>Average</th>
          <th className="px-3">Standard Deviation</th>
        </tr>
      </thead>
      <tbody>
        {sensor.data.map((v, i) => {
          const tsEq = v.timestamp === timestamp;
          return (
            <tr
              className={cn('hover:bg-gray-300', {
                ['bg-blue-300']: tsEq,
              })}
              key={i}
              onClick={() => onSelect(v.timestamp)}
            >
              <td className="px-3 text-left">{v.timestamp}</td>
              <td>{formatValue(v.min)}</td>
              <td>{formatValue(v.max)}</td>
              <td>{formatValue(v.avg)}</td>
              <td className="px-3">{formatValue(v.std)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
