export type RouteSegments = {
  first: string;
  second?: string;
  embed?: string;
};

export function createBaseSegment(segments: RouteSegments): string {
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

export const routes = {
  guide: (segments: RouteSegments, step: 1 | 2) => `/${createBaseSegment(segments)}/navod/${step}`,
  question: (segments: RouteSegments, questionNumber: number) => `/${createBaseSegment(segments)}/otazka/${questionNumber}`,
  review: (segments: RouteSegments) => `/${createBaseSegment(segments)}/rekapitulace`,
  result: (segments: RouteSegments) => `/${createBaseSegment(segments)}/vysledek`,
} as const;
