import { buildDataUrl, calculatorViewModel } from "@kalkulacka-one/app";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { dataLoaderGuard } from "@/routing/guards/data-loader";

type CalculatorPageMetadataOptions = { key: string; group?: string; canonicalUrl: string; locale: string };

function titledPage(page: "guide" | "review" | "result" | "comparison") {
  return async ({ locale, ...options }: CalculatorPageMetadataOptions): Promise<Metadata> => {
    const t = await getTranslations({ locale, namespace: "koa.pages" });
    return buildCalculatorMetadata({ ...options, pageTitle: () => t(`${page}.title`) });
  };
}

export const calculatorMetadata = {
  guide: titledPage("guide"),
  question: async ({ locale, questionNumber, ...options }: CalculatorPageMetadataOptions & { questionNumber: number }): Promise<Metadata> => {
    const t = await getTranslations({ locale, namespace: "koa.pages" });
    return buildCalculatorMetadata({ ...options, pageTitle: ({ questionCount }) => t("question.documentTitle", { current: questionNumber, total: questionCount }) });
  },
  review: titledPage("review"),
  result: titledPage("result"),
  comparison: titledPage("comparison"),
} as const;

export async function generateCalculatorMetadata(options: Omit<Parameters<typeof buildCalculatorMetadata>[0], "pageTitle">): Promise<Metadata> {
  return buildCalculatorMetadata(options);
}

async function buildCalculatorMetadata({
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
