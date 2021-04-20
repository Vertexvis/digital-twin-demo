import { defineCustomElements } from "@vertexvis/viewer-react";
import React from "react";

interface Viewer {
  readonly isReady: boolean;
  readonly isRefReady: boolean;
  readonly onSceneReady: () => void;
  readonly ref: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

export function useViewer(): Viewer {
  const ref = React.useRef<HTMLVertexViewerElement>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [isRefReady, setIsRefReady] = React.useState(false);

  const onSceneReady = React.useCallback(() => {
    setIsRefReady(ref.current != null);
  }, [ref.current]);

  React.useEffect(() => {
    if (!isReady) {
      defineCustomElements().then(() => setIsReady(true));
    }
  }, []);

  return { isReady, isRefReady, ref, onSceneReady };
}
