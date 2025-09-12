import type { Metadata } from "next";

import { loadCalculatorData } from "../../calculator/lib";
import { buildDataUrl } from "../../calculator/lib/data-fetching/url-builders";
import { calculatorViewModel } from "../../calculator/view-models/server";

export async function generateCalculatorMetadata({ key, group }: { key: string; group?: string }): Promise<Metadata> {
  const { calculator: calculatorData } = await loadCalculatorData({ key, group });
  const calculator = calculatorViewModel(calculatorData);

  const ogImage = calculator.images?.find((img) => img.type === "opengraph");
  const twitterImage = calculator.images?.find((img) => img.type === "twitter");

  const ogImageUrl = ogImage?.urls?.original ? buildDataUrl({ key, group, resourcePath: ogImage.urls.original }) : undefined;
  const twitterImageUrl = twitterImage?.urls?.original ? buildDataUrl({ key, group, resourcePath: twitterImage.urls.original }) : ogImageUrl;

  const metadata: Metadata = {
    title: calculator.title || calculator.shortTitle,
    description: calculator.description,
    openGraph: {
      title: calculator.title || calculator.shortTitle,
      description: calculator.description,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: ogImage?.width,
            height: ogImage?.height,
            alt: ogImage?.alt,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.title || calculator.shortTitle,
      description: calculator.description,
      ...(twitterImageUrl && { images: [twitterImageUrl] }),
    },
  };

  return metadata;
}
