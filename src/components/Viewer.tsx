import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { VertexViewer, JSX as ViewerJSX } from '@vertexvis/viewer-react';
import { Environment } from '@vertexvis/viewer/dist/types/config/environment';
import { TapEventDetails } from '@vertexvis/viewer/dist/types/interactions/tapEventDetails';
import React, {
  ComponentType,
  FunctionComponent,
  MutableRefObject,
  RefAttributes,
} from 'react';

export interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly clientId: string;
  readonly streamKey: string;
  readonly configEnv: Environment;
  readonly viewer: MutableRefObject<HTMLVertexViewerElement | null>;
}

export type ViewerComponentType = ComponentType<
  ViewerProps & RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = RefAttributes<HTMLVertexViewerElement>;

export function Viewer({
  streamKey,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  return (
    <VertexViewer
      ref={viewer}
      className="w-full h-full"
      src={`urn:vertexvis:stream-key:${streamKey}`}
      {...props}
    />
  );
}

export interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (event: CustomEvent<TapEventDetails>) => {
          if (props.onTap) {
            props.onTap(event);
          }

          if (!event.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const raycaster = scene?.raycaster();

            if (raycaster != null) {
              const res = await raycaster.hitItems(event.detail.position);
              const hit = (res?.hits ?? [])[0];
              onSelect(hit);
            }
          }
        }}
      />
    );
  };
}
