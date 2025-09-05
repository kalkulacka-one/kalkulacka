export function createBaseSegment(segments: { first: string; second?: string; embed?: string }): string {
  const { first, second, embed } = segments;

  if (embed) {
    if (second) {
      return `embed/${embed}/${first}/${second}`;
    }
    return `embed/${embed}/${first}`;
  }
  if (second) {
    return `${first}/${second}`;
  }
  return first;
}
