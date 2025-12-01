import { prisma } from "@kalkulacka-one/database";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { calculateMatches } from "@/calculator/result-calculation";
import { PublicResultPageWithData } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { buildCanonicalUrl, canonical, mappedParams } from "@/lib/routing";

import type { Answer } from "../../../../../../../../../../../../../packages/schema/schemas/answer.schema";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ locale: string; first: string; second: string; third: string; publicId: string }> }): Promise<Metadata> {
  const { locale, publicId, ...segments } = await routeParams;
  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const canonicalUrl = canonical.publicResult(segments, publicId, locale);
  const ogImageUrl = buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`);
  return await generateCalculatorMetadata({
    key,
    group,
    canonicalUrl,
    ogImage: {
      url: ogImageUrl,
      width: 2400,
      height: 1260,
    },
  });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; publicId: string }> }) {
  const { publicId, ...segments } = await params;

  const session = await prisma.calculatorSession.findUnique({
    where: {
      publicId,
    },
    include: {
      data: true,
    },
  });

  if (!session || !session.data) {
    notFound();
  }

  const answers = session.data.answers as Answer[];
  const result = session.data.result as ReturnType<typeof calculateMatches>;

  return <PublicResultPageWithData algorithmMatches={result} answers={answers} segments={segments} />;
}
