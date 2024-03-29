import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { ColorMaterial, Components, TapEventDetails } from '@vertexvis/viewer';

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
  readonly hide: boolean;
  readonly suppliedIds: string[];
}

interface HandleHitReq extends Req {
  readonly detail: TapEventDetails;
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
  hide,
  suppliedIds,
  viewer,
}: HideSuppliedIdReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(suppliedIds));
      return hide
        ? w.clearMaterialOverrides().hide()
        : w.clearMaterialOverrides();
    })
    .execute();
}

export async function handleHit({
  detail,
  hit,
  viewer,
}: HandleHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  const id = hit?.itemId?.hex;
  if (id) {
    await scene
      .items((op) => {
        const idQuery = op.where((q) => q.withItemId(id));
        return [
          op.where((q) => q.all()).deselect(),
          // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#return_value
          detail.buttons === 2 ? idQuery.hide() : idQuery.select(),
        ];
      })
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}

export async function clearAll({
  showAll,
  viewer,
}: Req & { showAll: boolean }): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => {
      const w = op.where((q) => q.all());
      return showAll
        ? w.clearMaterialOverrides().show()
        : w.clearMaterialOverrides();
    })
    .execute();
}
