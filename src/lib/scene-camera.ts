import { SceneReq } from './scene-items';

export async function flyToSuppliedId({
  scene,
  suppliedId,
}: SceneReq & { suppliedId: string }): Promise<void> {
  if (scene == null) return;

  await scene
    .camera()
    .flyTo({ itemSuppliedId: suppliedId })
    .render({ animation: { milliseconds: 1500 } });
}
