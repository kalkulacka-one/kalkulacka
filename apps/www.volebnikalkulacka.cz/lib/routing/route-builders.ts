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
  introduction: (segments: RouteSegments) => `/${createBaseSegment(segments)}/uvod`,
  guide: (segments: RouteSegments) => `/${createBaseSegment(segments)}/navod`,
  question: (segments: RouteSegments, questionNumber: number) => `/${createBaseSegment(segments)}/otazka/${questionNumber}`,
  review: (segments: RouteSegments) => `/${createBaseSegment(segments)}/rekapitulace`,
  result: (segments: RouteSegments) => `/${createBaseSegment(segments)}/vysledek`,
} as const;
