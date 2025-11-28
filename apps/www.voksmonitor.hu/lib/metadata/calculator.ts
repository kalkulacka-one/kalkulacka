import type { Metadata } from "next";

import { loadCalculatorData } from "../../calculator/lib";
import { buildDataUrl } from "../../calculator/lib/data-fetching/url-builders";
import { calculatorViewModel } from "../../calculator/view-models/server";

export async function generateCalculatorMetadata({
  key,
  group,
  canonicalUrl,
  ogImage: ogImageOverride,
  twitterImage: twitterImageOverride,
}: {
  key: string;
  group?: string;
  canonicalUrl: string;
  ogImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  twitterImage?: {
    url: string;
    alt?: string;
  };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_CANONICAL_URL || "http://localhost:3000";
  const calculatorData = await loadCalculatorData({ key, group });
  const calculator = calculatorViewModel(calculatorData.data.calculator);

  const ogImage = calculator.images?.find((img) => img.type === "opengraph");
  const twitterImage = calculator.images?.find((img) => img.type === "twitter");

  let ogImageUrl: string | undefined;
  let ogImageWidth: number | undefined;
  let ogImageHeight: number | undefined;
  let ogImageAlt: string | undefined;

  if (ogImageOverride) {
    ogImageUrl = ogImageOverride.url;
    ogImageWidth = ogImageOverride.width;
    ogImageHeight = ogImageOverride.height;
    ogImageAlt = ogImageOverride.alt;
  } else if (ogImage?.urls?.original) {
    ogImageUrl = buildDataUrl({ key, group, resourcePath: ogImage.urls.original });
    ogImageWidth = ogImage.width;
    ogImageHeight = ogImage.height;
    ogImageAlt = ogImage.alt;
  }

  let twitterImageUrl: string | undefined;
  let twitterImageAlt: string | undefined;

  if (twitterImageOverride) {
    twitterImageUrl = twitterImageOverride.url;
    twitterImageAlt = twitterImageOverride.alt;
  } else if (twitterImage?.urls?.original) {
    twitterImageUrl = buildDataUrl({ key, group, resourcePath: twitterImage.urls.original });
    twitterImageAlt = twitterImage.alt;
  } else {
    twitterImageUrl = ogImageUrl;
    twitterImageAlt = ogImageAlt;
  }

  const metadata: Metadata = {
    title: "Fővárosi Közgyűlés Voksmonitor 2025",
    description: "Voksmonitor 2025 - Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
    alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: "Fővárosi Közgyűlés Voksmonitor 2025",
      description: "Voksmonitor 2025 - Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl || "/og-image.png",
          width: ogImageWidth || 1200,
          height: ogImageHeight || 630,
          alt: ogImageAlt || "Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      ...(process.env.X_HANDLE && { site: process.env.X_HANDLE }),
      ...(twitterImageUrl && {
        images: {
          url: twitterImageUrl,
          alt: twitterImageAlt,
        },
      }),
    },
  };

  return metadata;
}
