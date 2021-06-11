import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { ColorMaterial, Components } from "@vertexvis/viewer";

import { SelectColor } from "./colors";

export interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface ColorGroup {
  readonly color: string;
  readonly suppliedIds: string[];
}

interface ApplyReq extends Req {
  readonly apply: boolean;
}

interface ApplyGroupsBySuppliedIdsReq extends ApplyReq {
  readonly groups: ColorGroup[];
}

interface ApplyAndShowBySuppliedIdsReq extends Req {
  readonly all: boolean;
  readonly group: ColorGroup;
}

interface HideSuppliedIdReq extends Req {
  readonly suppliedIds: string[];
}

interface SelectByHitReq extends Req {
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

export async function applyGroupsBySuppliedIds({
  apply,
  groups,
  viewer,
}: ApplyGroupsBySuppliedIdsReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
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
  viewer,
}: ApplyAndShowBySuppliedIdsReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
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
  suppliedIds,
  viewer,
}: HideSuppliedIdReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => [op.where((q) => q.withSuppliedIds(suppliedIds)).hide()])
    .execute();
}

export async function selectByHit({
  hit,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  const id = hit?.itemId?.hex;
  const suppliedId = hit?.itemSuppliedId?.value;
  if (id) {
    console.debug(`Selected ${id}${suppliedId ? `, ${suppliedId}` : ""}`);

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

export async function showAndClearAll({ viewer }: Req): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
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
