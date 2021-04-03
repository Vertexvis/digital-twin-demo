import cn from 'classnames';
import React from 'react';
import { Icon } from './Icon';

interface Props {
  readonly isOpen: boolean;
  readonly onSelected: (isOpen: boolean) => void;
}

export function LeftSidebar({ isOpen, onSelected }: Props): JSX.Element {
  return (
    <div className="flex flex-col items-center h-full w-full relative border-gray-300 border-r border-l py-2">
      <div
        className={cn('w-8 h-8 mb-2 p-1 cursor-pointer hover:bg-gray-200', {
          ['text-blue-700']: isOpen,
        })}
        onClick={() => onSelected(!isOpen)}
      >
        <Icon icon="list" />
      </div>
    </div>
  );
}
