import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { SelectColor } from './colors';

export interface SceneReq {
  readonly scene?: Scene;
}

export interface ColorGroup {
  readonly color: string;
  readonly suppliedIds: string[];
}

interface ApplyReq extends SceneReq {
  readonly apply: boolean;
}

interface ApplyGroupsBySuppliedIdsReq extends ApplyReq {
  readonly groups: ColorGroup[];
}

interface ApplyOrClearBySuppliedIdsReq extends ApplyReq {
  group: ColorGroup;
}

interface SelectByHitReq extends SceneReq {
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

export async function applyGroupsBySuppliedIds({
  apply,
  groups,
  scene,
}: ApplyGroupsBySuppliedIdsReq): Promise<void> {
  if (scene == null) return;

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
  if (scene == null) return;

  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(suppliedIds));
      return apply
        ? [w.materialOverride(ColorMaterial.fromHex(color)), w.show()]
        : [w.hide()];
    })
    .execute();
}

export async function hideAll({ scene }: SceneReq): Promise<void> {
  return all({ show: false, scene });
}

export async function selectByHit({
  hit,
  scene,
}: SelectByHitReq): Promise<void> {
  if (scene == null) return;

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

export async function showAll({ scene }: SceneReq): Promise<void> {
  return all({ show: true, scene });
}

async function all({
  show,
  scene,
}: SceneReq & { show: boolean }): Promise<void> {
  if (scene == null) return;

  await scene
    .items((op) => {
      const w = op.where((q) => q.all());
      return [show ? w.show() : w.hide()];
    })
    .execute();
}
