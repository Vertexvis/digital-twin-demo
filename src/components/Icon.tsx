import React, { ReactNode } from 'react';

type IconType = 'caret-right' | 'chart' | 'close' | 'list';

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
    case 'chart':
      return chart;
    case 'close':
      return close;
    case 'list':
      return list;
    default:
      return <></>;
  }
}

function baseIcon(icon: ReactNode, testId: string): JSX.Element {
  return (
    <svg
      data-testid={`icon-${testId}`}
      className="fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      {icon}
    </svg>
  );
}

const caretRight = baseIcon(
  <path d="M10.83,7.63l-5-4.5a.5.5,0,0,0-.66.74L9.75,8,5.17,12.13a.5.5,0,1,0,.66.74l5-4.5a.49.49,0,0,0,0-.74Z" />,
  'caret-right'
);

const chart = baseIcon(
  <path d="M12.5,1h-9A2.5,2.5,0,0,0,1,3.5v9A2.5,2.5,0,0,0,3.5,15h9A2.5,2.5,0,0,0,15,12.5v-9A2.5,2.5,0,0,0,12.5,1ZM14,12.5A1.5,1.5,0,0,1,12.5,14h-9A1.5,1.5,0,0,1,2,12.5V9H3.5A.51.51,0,0,0,4,8.62L4.5,6.56,6,12.62a.51.51,0,0,0,.47.38A.5.5,0,0,0,7,12.66L9.43,5.29,11,11.62a.51.51,0,0,0,1,0L12.89,8H14ZM14,7H12.5a.51.51,0,0,0-.49.38L11.5,9.44,10,3.38A.51.51,0,0,0,9.52,3,.5.5,0,0,0,9,3.34L6.57,10.71,5,4.38a.51.51,0,0,0-1,0L3.11,8H2V3.5A1.5,1.5,0,0,1,3.5,2h9A1.5,1.5,0,0,1,14,3.5Z" />,
  'chart'
);

const close = baseIcon(
  <path d="M8.71,8l4.14-4.15a.49.49,0,0,0-.7-.7L8,7.29,3.85,3.15a.49.49,0,0,0-.7.7L7.29,8,3.15,12.15a.49.49,0,0,0,.7.7L8,8.71l4.15,4.14a.49.49,0,0,0,.7-.7Z" />,
  'close'
);

const list = baseIcon(
  <path d="M14,3.5a.5.5,0,0,0-.5-.5H2.5a.5.5,0,0,0,0,1h11A.5.5,0,0,0,14,3.5ZM13.5,12h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0-6h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0,3h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Z" />,
  'list'
);
