import cn from 'classnames';
import React from 'react';
import { formatValue, SensorMeta } from '../lib/time-series';
import { Collapsible } from './Collapsible';
import { Panel } from './Panel';

interface Props {
  readonly displayed: Set<string>;
  readonly onCheck: (sensorId: string, checked: boolean) => Promise<void>;
  readonly onSelect: (sensorId: string) => Promise<void>;
  readonly selected: string;
  readonly selectedTs: string;
  readonly sensorsMeta: SensorMeta[];
}

export function Sidebar({
  displayed,
  onCheck,
  onSelect,
  selected,
  selectedTs,
  sensorsMeta,
}: Props): JSX.Element {
  return (
    <Panel position="right">
      <div className="w-full pr-2 border-b text-gray-700">
        <Collapsible title="SENSORS">
          <table className="text-left mb-4 w-full table-fixed">
            <thead>
              <tr>
                <th className="w-1/6"></th>
                <th className="w-2/6">Value</th>
                <th className="w-3/6">Name</th>
              </tr>
            </thead>
            <tbody>
              {sensorsMeta.map((s) => {
                const tsd = s.tsData
                  ? s.tsData[selectedTs]
                  : { color: '#fff', value: 0 };
                return (
                  <tr
                    key={s.sensorId}
                    className={cn('hover:bg-gray-300', {
                      ['bg-blue-300']: s.sensorId === selected,
                      ['odd:bg-gray-100']: s.sensorId !== selected,
                    })}
                    onClick={() => onSelect(s.sensorId)}
                  >
                    <td>
                      <input
                        className="rounded-sm ml-4 mb-1"
                        type="checkbox"
                        checked={displayed.has(s.sensorId)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onCheck(s.sensorId, e.target.checked)}
                      />
                    </td>
                    <td className="flex items-center">
                      <div
                        className="rounded-sm mt-0.5 mr-2 h-4 w-4"
                        style={{ backgroundColor: tsd.color }}
                      ></div>
                      {formatValue(tsd.value)}
                    </td>
                    <td>{s.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Collapsible>
      </div>
    </Panel>
  );
}
