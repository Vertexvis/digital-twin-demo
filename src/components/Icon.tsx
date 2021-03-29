import React, { ReactNode } from 'react';

type IconType = 'caret-right' | 'close';

interface Props {
  readonly icon: IconType;
}

export function Icon({ icon }: Props): JSX.Element {
  return getIcon(icon);
}

function getIcon(type: string): JSX.Element {
  switch (type) {
    case 'caret-right':
      return caretRight;
    case 'close':
      return close;
    default:
      return <></>;
  }
}

const baseIcon = (icon: ReactNode): JSX.Element => (
  <svg
    className="fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
  >
    {icon}
  </svg>
);

const caretRight = baseIcon(
  <path d="M10.83,7.63l-5-4.5a.5.5,0,0,0-.66.74L9.75,8,5.17,12.13a.5.5,0,1,0,.66.74l5-4.5a.49.49,0,0,0,0-.74Z" />
);

const close = baseIcon(
  <path d="M8.71,8l4.14-4.15a.49.49,0,0,0-.7-.7L8,7.29,3.85,3.15a.49.49,0,0,0-.7.7L7.29,8,3.15,12.15a.49.49,0,0,0,.7.7L8,8.71l4.15,4.14a.49.49,0,0,0,.7-.7Z" />
);
