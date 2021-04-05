import React, { ReactNode } from 'react';

type IconType = 'caret-right' | 'chart' | 'close' | 'error' | 'list' | 'warn';

interface Props {
  readonly icon: IconType;
}

export function Icon({ icon }: Props): JSX.Element {
  switch (icon) {
    case 'caret-right':
      return caretRight;
    case 'chart':
      return chart;
    case 'close':
      return close;
    case 'error':
      return error;
    case 'list':
      return list;
    case 'warn':
      return warn;
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

const error = baseIcon(
  <path d="M8,1a7,7,0,1,0,7,7A7,7,0,0,0,8,1Zm4.27,11.23A6,6,0,1,1,14,8,6,6,0,0,1,12.27,12.27ZM8,4a.5.5,0,0,0-.5.5v5a.5.5,0,0,0,1,0v-5A.5.5,0,0,0,8,4Zm0,7a.51.51,0,1,0,.35.15A.47.47,0,0,0,8,11Z" />,
  'error'
);

const list = baseIcon(
  <path d="M14,3.5a.5.5,0,0,0-.5-.5H2.5a.5.5,0,0,0,0,1h11A.5.5,0,0,0,14,3.5ZM13.5,12h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0-6h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0,3h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Z" />,
  'list'
);

const warn = baseIcon(
  <path d="M14.65,12.29ZM8,11a.51.51,0,1,0,.35.15A.47.47,0,0,0,8,11ZM8,6a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,1,0v-3A.5.5,0,0,0,8,6Zm6.65,6.29L9.32,2.4h0a1.5,1.5,0,0,0-2.64,0L1.35,12.29h0a1.53,1.53,0,0,0-.18.71,1.5,1.5,0,0,0,1.5,1.5H13.33a1.5,1.5,0,0,0,1.5-1.5A1.53,1.53,0,0,0,14.65,12.29Zm-1,1.06a.47.47,0,0,1-.35.15H2.67a.47.47,0,0,1-.35-.15A.51.51,0,0,1,2.17,13l.06-.24h0L7.56,2.87h0a.5.5,0,0,1,.88,0l5.33,9.89h0l.06.24A.51.51,0,0,1,13.68,13.35Z" />,
  'warn'
);
