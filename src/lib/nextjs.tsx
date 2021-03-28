import { useRouter } from 'next/router';
import React, { ComponentType, FunctionComponent } from 'react';

export function waitForHydrate<P>(
  WrappedComponent: ComponentType<P>
): FunctionComponent<P> {
  return function Component(props) {
    const { isReady } = useRouter();
    return isReady ? <WrappedComponent {...props} /> : <></>;
  };
}
