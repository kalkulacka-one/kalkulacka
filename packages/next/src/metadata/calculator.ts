import { buildDataUrl, calculatorViewModel } from "@kalkulacka-one/app";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buildCanonicalUrl, type Canonical } from "@/routing/factories/url-builders";
import { dataLoaderGuard } from "@/routing/guards/data-loader";
import type { RouteSegments } from "@/routing/segments";

type MappedParams = { key: (segments: RouteSegments) => string; group: (segments: RouteSegments) => string | undefined };

export function createCalculatorMetadata({ canonical, mappedParams }: { canonical: Canonical; mappedParams: MappedParams }) {
  function build(segments: RouteSegments, canonicalUrl: string, options: Pick<Parameters<typeof buildMetadata>[0], "pageTitle" | "ogImage"> = {}): Promise<Metadata> {
    return buildMetadata({ key: mappedParams.key(segments), group: mappedParams.group(segments), canonicalUrl, ...options });
  }

  function titledPage(page: "guide" | "review" | "result" | "comparison") {
    return async (segments: RouteSegments, locale: string): Promise<Metadata> => {
      const t = await getTranslations({ locale, namespace: "koa.pages" });
      return build(segments, canonical[page](segments, locale), { pageTitle: () => t(`${page}.title`) });
    };
  }

  const calculatorMetadata = {
    introduction: (segments: RouteSegments, locale: string): Promise<Metadata> => build(segments, canonical.introduction(segments, locale)),
    guide: titledPage("guide"),
    question: async (segments: RouteSegments, questionNumber: number, locale: string): Promise<Metadata> => {
      const t = await getTranslations({ locale, namespace: "koa.pages" });
      return build(segments, canonical.question(segments, questionNumber, locale), {
        pageTitle: ({ questionCount }) => t("question.documentTitle", { current: questionNumber, total: questionCount }),
      });
    },
    review: titledPage("review"),
    result: titledPage("result"),
    comparison: titledPage("comparison"),
    publicResult: (segments: RouteSegments, publicId: string, locale: string): Promise<Metadata> =>
      build(segments, canonical.publicResult(segments, publicId, locale), {
        ogImage: { url: buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`), width: 2400, height: 1260 },
      }),
  } as const;

  return { calculatorMetadata };
}

async function buildMetadata({
  key,
  group,
  canonicalUrl,
  pageTitle,
  ogImage: ogImageOverride,
  twitterImage: twitterImageOverride,
}: {
  key: string;
  group?: string;
  canonicalUrl: string;
  pageTitle?: (context: { questionCount: number }) => string;
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
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }

  const calculatorData = await dataLoaderGuard({ endpoint: process.env.DATA_ENDPOINT, key, group });
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
    ogImageUrl = buildDataUrl({ endpoint: process.env.DATA_ENDPOINT, key, group, resourcePath: ogImage.urls.original });
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
    twitterImageUrl = buildDataUrl({ endpoint: process.env.DATA_ENDPOINT, key, group, resourcePath: twitterImage.urls.original });
    twitterImageAlt = twitterImage.alt;
  } else {
    twitterImageUrl = ogImageUrl;
    twitterImageAlt = ogImageAlt;
  }

  const calculatorTitle = calculator.title || calculator.shortTitle;
  const currentPageTitle = pageTitle?.({ questionCount: calculatorData.data.questions.length });

  const metadata: Metadata = {
    title: currentPageTitle ? `${currentPageTitle} · ${calculatorTitle}` : calculatorTitle,
    description: calculator.description,
    alternates: {
      canonical: canonicalUrl,
    },
    // Bare calculator title, so a link shared mid-flow doesn't preview as "Otázka 7/30".
    openGraph: {
      title: calculatorTitle,
      description: calculator.description,
      url: canonicalUrl,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: ogImageWidth,
            height: ogImageHeight,
            alt: ogImageAlt,
          },
        ],
      }),
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
