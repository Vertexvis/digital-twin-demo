import cn from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  readonly position?: 'left' | 'right' | 'bottom';
  readonly overlay?: boolean;
  readonly children: ReactNode;
}

export function Panel({
  children,
  position = 'left',
  overlay = true,
}: Props): JSX.Element {
  return position === 'bottom' ? (
    <div className={'flex'}>
      <div
        className={
          'h-80 w-full overflow-scroll z-overlay bg-white absolute inset-x-0 bottom-0'
        }
      >
        <div className={'h-full w-full border-gray-300 border-t'}>
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div
      className={cn('relative', {
        ['ml-auto']: position === 'right',
        ['w-0 flex-shrink-0 overflow-visible']: overlay,
      })}
    >
      <div
        className={cn('h-full w-80 overflow-visible z-overlay bg-white', {
          ['right-0']: position === 'right',
          ['absolute']: overlay,
        })}
      >
        <div
          className={cn('h-full w-full border-gray-300 shadow', {
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
