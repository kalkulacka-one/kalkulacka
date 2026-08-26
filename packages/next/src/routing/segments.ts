export type RouteSegments = {
  first: string;
  second?: string;
  third?: string;
  embed?: string;
};

export function createBaseSegment(segments: RouteSegments): string {
  const { first, second, third, embed } = segments;

  if (embed) {
    if (third) {
      return `embed/${embed}/${first}/${second}/${third}`;
    }
    if (second) {
      return `embed/${embed}/${first}/${second}`;
    }
    return `embed/${embed}/${first}`;
  }
  if (third) {
    return `${first}/${second}/${third}`;
  }
  if (second) {
    return `${first}/${second}`;
  }
  return first;
}
