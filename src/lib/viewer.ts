import { defineCustomElements } from '@vertexvis/viewer-react';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface ViewerContext {
  readonly viewer: MutableRefObject<HTMLVertexViewerElement | null>;
  readonly onSceneReady: () => void;
  readonly viewerState: ViewerState;
}

interface ViewerState {
  readonly sceneViewId?: string;
  readonly isReady: boolean;
}

export function useViewer(): ViewerContext {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = useState<ViewerState>({ isReady: false });

  const onSceneReady = useCallback(async () => {
    const scene = await ref.current?.scene();
    setState({ ...state, sceneViewId: scene?.sceneViewId });
  }, [state]);

  useEffect(() => {
    async function setup(): Promise<void> {
      await defineCustomElements();
      setState({ ...(state ?? {}), isReady: true });
    }

    if (!state.isReady) {
      setup();
    }
  }, [state]);

  return { viewer: ref, viewerState: state, onSceneReady };
}
