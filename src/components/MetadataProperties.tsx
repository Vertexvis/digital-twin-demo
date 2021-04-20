import React from 'react';
import { Properties } from '../lib/metadata';

interface Props {
  readonly properties: Properties;
}

export function MetadataProperties({ properties }: Props): JSX.Element {
  const propKeys = Object.keys(properties);

  return propKeys.length > 0 ? (
    <table className="text-left mb-4 w-full">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {propKeys.map((k) => (
          <tr key={k} className={'whitespace-nowrap hover:bg-gray-300'}>
            <td>{k}</td>
            <td>{properties[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="my-4 text-center">No data</p>
  );
}
