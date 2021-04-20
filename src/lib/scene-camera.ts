import { Req } from "./scene-items";

export async function flyToSuppliedId({
  suppliedId,
  viewer,
}: Req & { suppliedId: string }): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .camera()
    .flyTo({ itemSuppliedId: suppliedId })
    .render({ animation: { milliseconds: 1500 } });
}
