import cn from 'classnames';
import { formatValue, Sensor } from '../lib/time-series';

interface Props {
  readonly onSelect: (timestamp: string) => Promise<void>;
  readonly sensor: Sensor;
  readonly timestamp: string;
}

export function DataSheet({ onSelect, sensor, timestamp }: Props): JSX.Element {
  return (
    <table className="text-left w-full table-auto">
      <caption className="text-xl">{sensor.meta.name}</caption>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Minimum</th>
          <th>Maximum</th>
          <th>Average</th>
          <th>Standard Deviation</th>
        </tr>
      </thead>
      <tbody>
        {sensor.data.map((v, i) => (
          <tr
            className={cn('hover:bg-gray-300', {
              ['bg-blue-300']: v.timestamp === timestamp,
              ['odd:bg-gray-100']: v.timestamp !== timestamp,
            })}
            key={i}
            onClick={() => onSelect(v.timestamp)}
          >
            <td>{v.timestamp}</td>
            <td>{formatValue(v.min)}</td>
            <td>{formatValue(v.max)}</td>
            <td>{formatValue(v.avg)}</td>
            <td>{formatValue(v.std)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
