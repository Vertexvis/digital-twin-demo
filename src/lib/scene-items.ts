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

interface ApplyAndShowBySuppliedIdsReq extends SceneReq {
  readonly all: boolean;
  readonly group: ColorGroup;
}

interface HideSuppliedIdReq extends SceneReq {
  readonly suppliedIds: string[];
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

export async function applyAndShowBySuppliedIds({
  all,
  group: { color, suppliedIds },
  scene,
}: ApplyAndShowBySuppliedIdsReq): Promise<void> {
  if (scene == null) return;

  await scene
    .items((op) => [
      ...(all ? [op.where((q) => q.all()).hide()] : []),
      op
        .where((q) => q.withSuppliedIds(suppliedIds))
        .materialOverride(ColorMaterial.fromHex(color))
        .show(),
    ])
    .execute();
}

export async function hideBySuppliedId({
  scene,
  suppliedIds,
}: HideSuppliedIdReq): Promise<void> {
  if (scene == null) return;

  await scene
    .items((op) => [op.where((q) => q.withSuppliedIds(suppliedIds)).hide()])
    .execute();
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

export async function showAndClearAll({ scene }: SceneReq): Promise<void> {
  if (scene == null) return;

  await scene
    .items((op) =>
      op
        .where((q) => q.all())
        .clearMaterialOverrides()
        .show()
    )
    .execute();
}
