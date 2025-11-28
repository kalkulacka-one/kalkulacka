export type RouteSegments = {
  first: string;
  second?: string;
  third?: string;
  embed?: string;
};

export const ROUTE_SEGMENTS = {
  INTRODUCTION: "introduction",
  GUIDE: "guide",
  QUESTION: "question",
  REVIEW: "review",
  RESULT: "result",
  COMPARISON: "comparison",
} as const;

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

export const routes = {
  introduction: (segments: RouteSegments) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.INTRODUCTION}`,
  guide: (segments: RouteSegments) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.GUIDE}`,
  question: (segments: RouteSegments, questionNumber: number) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.QUESTION}/${questionNumber}`,
  review: (segments: RouteSegments) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.REVIEW}`,
  result: (segments: RouteSegments) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.RESULT}`,
  publicResult: (segments: RouteSegments, publicId: string) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.RESULT}/${publicId}`,
  comparison: (segments: RouteSegments) => `/${createBaseSegment(segments)}/${ROUTE_SEGMENTS.COMPARISON}`,
} as const;
