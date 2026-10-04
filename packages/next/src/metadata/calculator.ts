import { buildDataUrl, type CalculatorData, calculatorViewModel, prefixPageTitle } from "@kalkulacka-one/app";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import type { createParamsMapper } from "@/routing/factories/params-mapper";
import { buildCanonicalUrl, type Canonical } from "@/routing/factories/url-builders";
import { dataLoaderGuard } from "@/routing/guards/data-loader";
import type { RouteSegments } from "@/routing/segments";

type MappedParams = ReturnType<typeof createParamsMapper>["mappedParams"];
type Translator = Awaited<ReturnType<typeof getTranslations>>;
type Image = { url: string; width?: number; height?: number; alt?: string };

type BuildOptions = {
  segments: RouteSegments;
  locale: string;
  canonicalUrl: string;
  pageTitle?: (t: Translator, data: CalculatorData["data"]) => string;
  ogImage?: Image;
};

export function createCalculatorMetadata({ canonical, mappedParams }: { canonical: Canonical; mappedParams: MappedParams }) {
  async function build({ segments, locale, canonicalUrl, pageTitle, ogImage }: BuildOptions): Promise<Metadata> {
    const endpoint = process.env.DATA_ENDPOINT;
    if (!endpoint) {
      throw new Error("DATA_ENDPOINT environment variable is not set");
    }

    const key = mappedParams.key(segments);
    const group = mappedParams.group(segments);
    const { data } = await dataLoaderGuard({ endpoint, key, group });
    const calculator = calculatorViewModel(data.calculator);

    const dataImage = (type: "opengraph" | "twitter"): Image | undefined => {
      const image = calculator.images?.find((img) => img.type === type);
      if (!image?.urls?.original) return undefined;
      return { url: buildDataUrl({ endpoint, key, group, resourcePath: image.urls.original }), width: image.width, height: image.height, alt: image.alt };
    };
    const openGraphImage = ogImage ?? dataImage("opengraph");
    const twitterImage = dataImage("twitter") ?? openGraphImage;

    const calculatorTitle = calculator.title || calculator.shortTitle;
    const title = pageTitle && calculatorTitle ? prefixPageTitle(pageTitle(await getTranslations({ locale, namespace: "koa.pages" }), data), calculatorTitle) : calculatorTitle;

    return {
      title,
      description: calculator.description,
      alternates: { canonical: canonicalUrl },
      // Bare calculator title, so a link shared mid-flow doesn't preview as "Otázka 7/30".
      openGraph: {
        title: calculatorTitle,
        description: calculator.description,
        url: canonicalUrl,
        ...(openGraphImage && { images: [openGraphImage] }),
      },
      twitter: {
        card: "summary_large_image",
        ...(process.env.X_HANDLE && { site: process.env.X_HANDLE }),
        ...(twitterImage && { images: { url: twitterImage.url, alt: twitterImage.alt } }),
      },
    };
  }

  const calculatorMetadata = {
    introduction: (segments: RouteSegments, locale: string) => build({ segments, locale, canonicalUrl: canonical.introduction(segments, locale) }),
    guide: (segments: RouteSegments, locale: string) => build({ segments, locale, canonicalUrl: canonical.guide(segments, locale), pageTitle: (t) => t("guide.title") }),
    question: (segments: RouteSegments, questionNumber: number, locale: string) =>
      build({
        segments,
        locale,
        canonicalUrl: canonical.question(segments, questionNumber, locale),
        pageTitle: (t, data) => {
          if (questionNumber > data.questions.length) notFound();
          return t("question.documentTitle", { current: questionNumber, total: data.questions.length });
        },
      }),
    review: (segments: RouteSegments, locale: string) => build({ segments, locale, canonicalUrl: canonical.review(segments, locale), pageTitle: (t) => t("review.title") }),
    result: (segments: RouteSegments, locale: string) => build({ segments, locale, canonicalUrl: canonical.result(segments, locale), pageTitle: (t) => t("result.title") }),
    comparison: (segments: RouteSegments, locale: string) => build({ segments, locale, canonicalUrl: canonical.comparison(segments, locale), pageTitle: (t) => t("comparison.title") }),
    publicResult: (segments: RouteSegments, publicId: string, locale: string) =>
      build({
        segments,
        locale,
        canonicalUrl: canonical.publicResult(segments, publicId, locale),
        ogImage: { url: buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`), width: 2400, height: 1260 },
      }),
  };

  return { calculatorMetadata };
}
