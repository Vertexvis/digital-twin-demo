import cn from 'classnames';
import React from 'react';
import { Properties } from '../lib/metadata';
import { formatValue, SensorMeta } from '../lib/time-series';
import { Collapsible } from './Collapsible';
import { Icon } from './Icon';
import { Panel } from './Panel';

export interface FaultCode {
  id: string;
  severity: 'warn' | 'error';
  title: string;
  timestamp: string;
}

interface Props {
  readonly assets: {
    readonly list: string[];
    readonly onSelect: (asset: string) => Promise<void>;
    readonly selected: string;
  };
  readonly faults: {
    readonly list: FaultCode[];
    readonly onSelect: (timestamp: string) => Promise<void>;
    readonly selected?: string;
  };
  readonly itemProperties: Properties;
  readonly selectedTs: string;
  readonly sensors: {
    readonly displayed: Set<string>;
    readonly list: SensorMeta[];
    readonly onCheck: (sensorId: string, checked: boolean) => Promise<void>;
    readonly onSelect: (sensorId: string) => Promise<void>;
    readonly selected: string;
  };
}

export function RightSidebar({
  assets,
  faults,
  itemProperties,
  selectedTs,
  sensors,
}: Props): JSX.Element {
  const propKeys = Object.keys(itemProperties);

  return (
    <Panel position="right" overlay={false}>
      <div className="w-full pr-2 border-b text-gray-700 text-sm">
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
              {sensors.list.map((s) => {
                const isSelected = s.sensorId === sensors.selected;
                const tsd = s.tsData
                  ? s.tsData[selectedTs]
                  : { color: '#fff', value: 0 };
                return (
                  <tr
                    key={s.sensorId}
                    className={cn('hover:bg-gray-300', {
                      ['bg-blue-300']: isSelected,
                      ['odd:bg-gray-100']: !isSelected,
                    })}
                    onClick={() => sensors.onSelect(s.sensorId)}
                  >
                    <td>
                      <input
                        className="rounded-sm ml-4 mb-1"
                        type="checkbox"
                        checked={sensors.displayed.has(s.sensorId)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          sensors.onCheck(s.sensorId, e.target.checked)
                        }
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
        <Collapsible title="ASSETS">
          {assets.list.length > 0 ? (
            <table className="text-left mb-4 w-full table-auto">
              <tbody>
                {assets.list.map((a) => {
                  const isSelected = a === assets.selected;
                  return (
                    <tr
                      key={a}
                      className={cn('hover:bg-gray-300', {
                        ['bg-blue-300']: isSelected,
                        ['odd:bg-gray-100']: !isSelected,
                      })}
                      onClick={() => assets.onSelect(a)}
                    >
                      <td>{a}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="my-4 text-center text-sm">No data</p>
          )}
        </Collapsible>
        <Collapsible title="FAULT CODES">
          {faults.list.length > 0 ? (
            <table className="text-left mb-4 w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/6"></th>
                  <th className="w-3/6">Fault</th>
                  <th className="w-2/6">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {faults.list.map((f) => {
                  const isSelected = f.timestamp === faults.selected;
                  return (
                    <tr
                      key={f.id}
                      className={cn('hover:bg-gray-300', {
                        ['bg-blue-300']: isSelected,
                        ['odd:bg-gray-100']: !isSelected,
                      })}
                      onClick={() => faults.onSelect(f.timestamp)}
                    >
                      <td>
                        <div className="w-5 ml-4">
                          <Icon icon={f.severity} />
                        </div>
                      </td>
                      <td>{f.title}</td>
                      <td>{f.timestamp.substring(11, 19)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="my-4 text-center text-sm">No data</p>
          )}
        </Collapsible>
        <Collapsible title="METADATA PROPERTIES">
          {propKeys.length > 0 ? (
            <table className="text-left mb-4 w-full table-auto">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {propKeys.map((k) => (
                  <tr key={k} className={'hover:bg-gray-300 odd:bg-gray-100'}>
                    <td>{k}</td>
                    <td>{itemProperties[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="my-4 text-center text-sm">No data</p>
          )}
        </Collapsible>
      </div>
    </Panel>
  );
}
