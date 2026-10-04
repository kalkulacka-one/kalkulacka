import { buildDataUrl, type CalculatorData, calculatorViewModel, prefixPageTitle } from "@kalkulacka-one/app";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import type { createParamsMapper } from "@/routing/factories/params-mapper";
import { buildCanonicalUrl, type Canonical } from "@/routing/factories/url-builders";
import { dataLoaderGuard } from "@/routing/guards/data-loader";
import type { RouteSegments } from "@/routing/segments";

async function buildMetadata({
  key,
  group,
  canonicalUrl,
  locale,
  pageTitle,
  ogImage: ogImageOverride,
  twitterImage: twitterImageOverride,
}: {
  key: string;
  group?: string;
  canonicalUrl: string;
  locale: string;
  pageTitle?: (t: Awaited<ReturnType<typeof getTranslations>>, data: CalculatorData["data"]) => string;
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
  const title = pageTitle && calculatorTitle ? prefixPageTitle(pageTitle(await getTranslations({ locale, namespace: "koa.pages" }), calculatorData.data), calculatorTitle) : calculatorTitle;

  const metadata: Metadata = {
    title,
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

export function createCalculatorMetadata({ canonical, mappedParams }: { canonical: Canonical; mappedParams: ReturnType<typeof createParamsMapper>["mappedParams"] }) {
  const forPage = (segments: RouteSegments, options: Omit<Parameters<typeof buildMetadata>[0], "key" | "group">) =>
    buildMetadata({ key: mappedParams.key(segments), group: mappedParams.group(segments), ...options });

  return {
    introduction: (segments: RouteSegments, locale: string) => forPage(segments, { locale, canonicalUrl: canonical.introduction(segments, locale) }),
    guide: (segments: RouteSegments, locale: string) => forPage(segments, { locale, canonicalUrl: canonical.guide(segments, locale), pageTitle: (t) => t("guide.title") }),
    question: (segments: RouteSegments, questionNumber: number, locale: string) =>
      forPage(segments, {
        locale,
        canonicalUrl: canonical.question(segments, questionNumber, locale),
        pageTitle: (t, data) => {
          if (questionNumber > data.questions.length) notFound();
          return t("question.documentTitle", { current: questionNumber, total: data.questions.length });
        },
      }),
    review: (segments: RouteSegments, locale: string) => forPage(segments, { locale, canonicalUrl: canonical.review(segments, locale), pageTitle: (t) => t("review.title") }),
    result: (segments: RouteSegments, locale: string) => forPage(segments, { locale, canonicalUrl: canonical.result(segments, locale), pageTitle: (t) => t("result.title") }),
    comparison: (segments: RouteSegments, locale: string) => forPage(segments, { locale, canonicalUrl: canonical.comparison(segments, locale), pageTitle: (t) => t("comparison.title") }),
    publicResult: (segments: RouteSegments, publicId: string, locale: string) =>
      forPage(segments, {
        locale,
        canonicalUrl: canonical.publicResult(segments, publicId, locale),
        ogImage: { url: buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`), width: 2400, height: 1260 },
      }),
  };
}
