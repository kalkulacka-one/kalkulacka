export type RouteSegments = {
  first: string;
  second?: string;
  embed?: string;
};

export function createBaseSegment(segments: RouteSegments): string {
  const { first, second, embed } = segments;

  if (embed) {
    if (second) {
      return `embed/${embed}/volby/${first}/${second}`;
    }
    return `embed/${embed}/volby/${first}`;
  }
  if (second) {
    return `volby/${first}/${second}`;
  }
  return `volby/${first}`;
}

export const routes = {
  introduction: (segments: RouteSegments) => `/${createBaseSegment(segments)}/bevezeto`,
  guide: (segments: RouteSegments) => `/${createBaseSegment(segments)}/utmutato`,
  question: (segments: RouteSegments, questionNumber: number) => `/${createBaseSegment(segments)}/kerdes/${questionNumber}`,
  review: (segments: RouteSegments) => `/${createBaseSegment(segments)}/osszegzes`,
  result: (segments: RouteSegments) => `/${createBaseSegment(segments)}/egyezeseim`,
  publicResult: (segments: RouteSegments, publicId: string) => `/${createBaseSegment(segments)}/egyezeseim/${publicId}`,
  comparison: (segments: RouteSegments) => `/${createBaseSegment(segments)}/osszehasonlitas`,
} as const;
