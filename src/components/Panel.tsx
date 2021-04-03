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
  const isBottom = position === 'bottom';
  const isLeft = position === 'left';
  const isRight = position === 'right';

  return (
    <div
      className={cn({
        ['flex']: isBottom,
        ['relative']: isLeft,
        ['relative ml-auto']: isRight,
        ['w-0 flex-shrink-0 overflow-visible']: overlay,
      })}
    >
      <div
        className={cn('z-overlay bg-white', {
          ['h-80 w-full overflow-scroll absolute inset-x-0 bottom-0']: isBottom,
          ['h-full w-80 overflow-visible']: isLeft,
          ['h-full w-80 overflow-visible right-0']: isRight,
          ['absolute']: overlay,
        })}
      >
        <div
          className={cn('h-full w-full border-gray-300', {
            ['border-t']: isBottom,
            ['border-r shadow']: isLeft,
            ['border-l shadow']: isRight,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
