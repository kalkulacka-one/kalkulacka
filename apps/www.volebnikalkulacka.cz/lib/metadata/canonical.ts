import type { Metadata } from "next";

export function generateCanonicalMetadata(canonicalUrl: string): Metadata {
  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
