import cn from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  readonly position?: 'left' | 'right';
  readonly overlay?: boolean;
  readonly children: ReactNode;
}

export function Panel({
  children,
  position = 'left',
  overlay,
}: Props): JSX.Element {
  return (
    <div
      className={cn('relative', {
        ['ml-auto']: position === 'right',
        ['w-0 flex-shrink-0 overflow-visible']: !!overlay,
      })}
    >
      <div
        className={cn('w-80 h-full overflow-visible z-overlay bg-white', {
          ['right-0']: position === 'right',
          ['absolute']: !!overlay,
        })}
      >
        <div
          className={cn('w-full h-full border-gray-300 shadow', {
            ['border-r']: position === 'left',
            ['border-l']: position === 'right',
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
