import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { SelectColor } from './colors';

export async function selectById(
  scene: Scene,
  itemId: string,
  suppliedId: string
): Promise<void> {
  if (itemId) {
    console.debug('Selected', itemId, suppliedId);

    await scene
      .items((op) => [
        op.where((q) => q.all()).deselect(),
        op.where((q) => q.withItemId(itemId)).select(SelectColor),
      ])
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}

export async function applyOrClearBySuppliedId(
  scene: Scene,
  ids: string[],
  color: string,
  apply: boolean
): Promise<void> {
  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(ids));
      return [
        apply
          ? w.materialOverride(ColorMaterial.fromHex(color))
          : w.clearMaterialOverrides(),
      ];
    })
    .execute();
}
