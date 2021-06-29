import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { TapEventDetails } from "@vertexvis/viewer";
import {
  JSX as ViewerJSX,
  VertexViewer,
  VertexViewerToolbar,
} from "@vertexvis/viewer-react";
import React from "react";

import { StreamCredentials } from "../lib/env";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (
    detail: TapEventDetails,
    hit?: vertexvis.protobuf.stream.IHit
  ) => Promise<void>;
}

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
  },
}));

export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const { root } = useStyles();
  const RenderOptions = { animation: { milliseconds: 1500 } };

  async function fitAll(): Promise<void> {
    (await viewer.current?.scene())?.camera().viewAll().render(RenderOptions);
  }

  return (
    <VertexViewer
      className={root}
      clientId={credentials.clientId}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
      {...props}
    >
      <Box mb={2}>
        <VertexViewerToolbar>
          <ButtonGroup variant="contained">
            <Button onClick={() => fitAll()}>Fit all</Button>
          </ButtonGroup>
        </VertexViewerToolbar>
      </Box>
    </VertexViewer>
  );
}

function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }: P & OnSelectProps) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (e) => {
          if (props.onTap) props.onTap(e);

          if (!e.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const raycaster = scene?.raycaster();

            if (raycaster != null) {
              const res = await raycaster.hitItems(e.detail.position, {
                includeMetadata: true,
              });
              const hit = (res?.hits ?? [])[0];
              onSelect(e.detail, hit);
            }
          }
        }}
      />
    );
  };
}
