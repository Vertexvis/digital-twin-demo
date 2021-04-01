import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { SelectColor } from './colors';

export async function selectByHit({
  hit,
  scene,
}: {
  readonly hit?: vertexvis.protobuf.stream.IHit;
  readonly scene: Scene;
}): Promise<void> {
  const id = hit?.itemId?.hex;
  const suppliedId = hit?.itemSuppliedId?.value;
  if (id) {
    console.debug(`Selected ${id}${suppliedId ? `, ${suppliedId}` : ''}`);

    await scene
      .items((op) => [
        op.where((q) => q.all()).deselect(),
        op.where((q) => q.withItemId(id)).select(SelectColor),
      ])
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}

export async function applyOrClearBySuppliedId({
  apply,
  color,
  scene,
  suppliedIds,
}: {
  readonly apply: boolean;
  readonly color: string;
  readonly scene: Scene;
  readonly suppliedIds: string[];
}): Promise<void> {
  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(suppliedIds));
      return [
        apply
          ? w.materialOverride(ColorMaterial.fromHex(color))
          : w.clearMaterialOverrides(),
      ];
    })
    .execute();
}
