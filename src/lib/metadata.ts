import { vertexvis } from '@vertexvis/frame-streaming-protos';

export interface Properties {
  [key: string]: string | undefined;
}

const PartRevIdKey = 'PART_REVISION_ID';
const PartInstIdKey = 'PART_INSTANCE_ID';

export function toProperties({
  metadata,
}: {
  metadata?: vertexvis.protobuf.stream.IMetadata | null;
}): Properties {
  if (metadata == null) return {};

  const ps: Properties = {};
  const { partRevisionId, partInstanceId } = metadata;
  if (partRevisionId?.hex) ps[PartRevIdKey] = partRevisionId.hex;
  if (partInstanceId?.hex) ps[PartInstIdKey] = partInstanceId.hex;
  if (metadata.properties) {
    metadata.properties
      .filter((p) => p.key)
      .forEach((p) => (ps[p.key as string] = toValue(p)));
  }

  return ps;
}

function toValue(
  property: vertexvis.protobuf.stream.IMetadataProperty
): string | undefined {
  if (property.asString) return property.asString;
  if (property.asFloat) return property.asFloat.toString();
  if (property.asLong) return property.asLong.toString();
  if (property.asDate) return property.asDate.iso ?? undefined;
  return undefined;
}
