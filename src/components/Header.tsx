import React, { ReactNode } from 'react';

interface Props {
  readonly logo?: ReactNode;
  readonly children?: ReactNode;
}

export function Header({ logo, children }: Props): JSX.Element {
  return (
    <div className="flex-center h-full w-full px-4 bg-gray-100 shadow-sm z-overlay relative border-b border-gray-400">
      {logo}
      <div className="flex-center w-full">{children}</div>
    </div>
  );
}
