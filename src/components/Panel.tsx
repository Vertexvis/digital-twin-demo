import cn from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly position?: 'left' | 'right' | 'bottom';
  readonly overflow?: 'scroll' | 'visible';
  readonly overlay?: boolean;
}

export function Panel({
  children,
  position = 'left',
  overflow,
  overlay = true,
}: Props): JSX.Element {
  const isBottom = position === 'bottom';
  const isLeft = position === 'left';
  const isRight = position === 'right';
  const common2 = `h-full w-80`;
  const common3 = `shadow min-h-full`;

  return (
    <div
      className={cn({
        ['flex']: isBottom,
        ['relative']: isLeft,
        ['relative ml-auto']: isRight,
        ['w-0 flex-shrink-0']: overlay,
      })}
    >
      <div
        className={cn('z-overlay bg-white', {
          [`h-80 w-full absolute inset-x-0 bottom-0`]: isBottom,
          [common2]: isLeft,
          [`${common2} right-0`]: isRight,
          ['absolute']: overlay,
        })}
      >
        <div
          className={cn(
            `w-full border-gray-300 overflow-${overflow ?? 'scroll'}`,
            {
              ['border-t h-full']: isBottom,
              [`border-r ${common3}`]: isLeft,
              [`border-l ${common3}`]: isRight,
            }
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
