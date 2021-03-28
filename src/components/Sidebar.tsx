import React from 'react';
import { Collapsible } from './Collapsible';
import { Panel } from './Panel';

export function Sidebar(): JSX.Element {
  return (
    <Panel position="right">
      <div className="w-full px-2 border-b text-gray-700">
        <Collapsible title="MY SIDEBAR">
          <p className="text-center text-sm mb-4">TODO</p>
        </Collapsible>
      </div>
    </Panel>
  );
}
