import cn from 'classnames';
import React from 'react';
import { Icon } from './Icon';

interface Props {
  isOpen: boolean;
  onSelected: (isOpen: boolean) => void;
}

export function TimeSeriesPanel({ isOpen, onSelected }: Props): JSX.Element {
  const sidebarIcon = 'w-8 h-8 mb-2 p-1 cursor-pointer hover:bg-gray-200';

  return (
    <div className="flex flex-col items-center h-full w-full relative border-neutral-300 border-r border-l py-2">
      <div
        className={cn(sidebarIcon, { ['text-blue-700']: isOpen })}
        onClick={() => onSelected(!isOpen)}
      >
        <Icon icon="list" />
      </div>
    </div>
  );
}
