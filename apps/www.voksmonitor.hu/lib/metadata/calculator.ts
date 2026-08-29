import type { Metadata } from "next";

import { loadCalculatorData } from "../../calculator/lib";
import { buildDataUrl } from "../../calculator/lib/data-fetching/url-builders";
import { calculatorViewModel } from "../../calculator/view-models/server";

function isEnglishCalculator({ key, canonicalUrl }: { key: string; canonicalUrl: string }): boolean {
  return key.toLowerCase().endsWith("-en") || canonicalUrl.toLowerCase().includes("-en");
}

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
  const isEn = isEnglishCalculator({ key, canonicalUrl });
  const metadataTitle = isEn ? "Hungarian Parliamentary Elections 2026 Voksmonitor" : "Országgyűlési választások 2026 Voksmonitor";
  const metadataDescription = isEn ? "Voksmonitor 2026 - Compare your answers with party positions." : "Voksmonitor 2026 - pártok álláspontjainak összehasonlítása.";

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
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      url: canonicalUrl,
      images: [
        {
          url: isEn ? "/og-image-en.png" : "/og-image.png",
          width: ogImageWidth || 1200,
          height: ogImageHeight || 630,
          alt: ogImageAlt || metadataDescription,
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
