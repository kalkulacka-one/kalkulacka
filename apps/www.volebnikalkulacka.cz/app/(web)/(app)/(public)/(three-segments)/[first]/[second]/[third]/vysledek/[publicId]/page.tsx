import { prisma } from "@repo/database";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { calculateMatches } from "@/calculator/result-calculation";
import { PublicResultPageWithData } from "@/components/client";
import { generateCalculatorMetadata } from "@/lib/metadata";
import { buildCanonicalUrl, canonical } from "@/lib/routing";

import type { Answer } from "@repo/schema/answer.schema";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string; third: string; publicId: string }> }): Promise<Metadata> {
  const { first, second, third, publicId } = await params;
  const canonicalUrl = canonical.publicResult({ first, second, third }, publicId);
  const ogImageUrl = buildCanonicalUrl(`/api/images/sessions/${publicId}/opengraph`);

  return await generateCalculatorMetadata({
    key: second,
    group: third,
    canonicalUrl,
    ogImage: {
      url: ogImageUrl,
      width: 2400,
      height: 1260,
    },
  });
}

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string; publicId: string }> }) {
  const { first, second, third, publicId } = await params;

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

  return <PublicResultPageWithData algorithmMatches={result} answers={answers} segments={{ first, second, third }} />;
}
