import { ColorMaterial, Scene } from '@vertexvis/viewer';

const SelectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: { r: 255, g: 255, b: 255, a: 0 },
};

export async function selectById(scene: Scene, itemId: string): Promise<void> {
  if (itemId) {
    console.debug('Selected', itemId);

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
