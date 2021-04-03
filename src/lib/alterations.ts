import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { SelectColor } from './colors';

export interface ColorGroup {
  readonly color: string;
  readonly suppliedIds: string[];
}

interface ApplyReq {
  readonly apply: boolean;
  readonly scene: Scene;
}

interface ApplyGroupsBySuppliedIdsReq extends ApplyReq {
  readonly groups: ColorGroup[];
}

interface ApplyOrClearBySuppliedIdsReq extends ApplyReq {
  group: ColorGroup;
}

interface SelectByHitReq {
  readonly hit?: vertexvis.protobuf.stream.IHit;
  readonly scene: Scene;
}

export async function applyGroupsBySuppliedIds({
  apply,
  groups,
  scene,
}: ApplyGroupsBySuppliedIdsReq): Promise<void> {
  await scene
    .items((op) =>
      groups.map((g) => {
        const w = op.where((q) => q.withSuppliedIds(g.suppliedIds));
        return apply
          ? w.materialOverride(ColorMaterial.fromHex(g.color))
          : w.clearMaterialOverrides();
      })
    )
    ?.execute();
}

export async function applyAndShowOrHideBySuppliedIds({
  apply,
  group: { color, suppliedIds },
  scene,
}: ApplyOrClearBySuppliedIdsReq): Promise<void> {
  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(suppliedIds));
      return apply
        ? [w.materialOverride(ColorMaterial.fromHex(color)), w.show()]
        : [w.hide()];
    })
    .execute();
}

export async function selectByHit({
  hit,
  scene,
}: SelectByHitReq): Promise<void> {
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
