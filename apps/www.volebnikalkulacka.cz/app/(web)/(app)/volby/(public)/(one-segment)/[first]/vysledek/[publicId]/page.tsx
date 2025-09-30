import { prisma } from "@repo/database";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Answer } from "../../../../../../../../../../../packages/schema/schemas/answer.schema";
import type { calculateMatches } from "../../../../../../../../../calculator/lib/result-calculation/calculate-matches";
import { PublicResultPageWithData } from "../../../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../../../lib/metadata/calculator";
import { buildCanonicalUrl, canonical } from "../../../../../../../../../lib/routing/url-builders";

export async function generateMetadata({ params }: { params: Promise<{ first: string; publicId: string }> }): Promise<Metadata> {
  const { first, publicId } = await params;
  const canonicalUrl = canonical.publicResult({ first }, publicId);
  const baseMetadata = await generateCalculatorMetadata({ key: first, canonicalUrl });

  const ogImageUrl = buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`);

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      images: {
        url: ogImageUrl,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ first: string; publicId: string }> }) {
  const { publicId } = await params;

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

  return <PublicResultPageWithData algorithmMatches={result} answers={answers} />;
}
