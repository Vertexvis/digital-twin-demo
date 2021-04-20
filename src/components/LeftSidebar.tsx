import cn from 'classnames';
import React from 'react';
import { Icon } from './Icon';

export type Options = 'data' | 'chart';

interface Props {
  readonly isOpen?: Options;
  readonly onSelected: (isOpen?: Options) => void;
}

export function LeftSidebar({ isOpen, onSelected }: Props): JSX.Element {
  return (
    <aside className="flex flex-col items-center h-full w-full relative border-gray-300 border-r border-l py-2">
      <div
        className={cn('w-8 h-8 mb-2 p-1 cursor-pointer hover:bg-gray-200', {
          ['text-blue-700']: isOpen === 'data',
        })}
        onClick={() => onSelected(isOpen === 'data' ? undefined : 'data')}
      >
        <Icon icon="list" />
      </div>
      <div
        className={cn('w-8 h-8 mb-2 p-1 cursor-pointer hover:bg-gray-200', {
          ['text-blue-700']: isOpen === 'chart',
        })}
        onClick={() => onSelected(isOpen === 'chart' ? undefined : 'chart')}
      >
        <Icon icon="chart" />
      </div>
    </aside>
  );
}
