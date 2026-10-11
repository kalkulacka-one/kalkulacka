import type { calculateMatches } from "@kalkulacka-one/app";
import { prisma } from "@kalkulacka-one/database";
import { sessionPathGuard } from "@kalkulacka-one/next";
import type { Answer } from "@kalkulacka-one/schema";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";

import { PublicResultPageWithData } from "@/components/client";
import { calculatorMetadata } from "@/lib/metadata";
import { mappedParams } from "@/lib/routing";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ locale: Locale; first: string; second: string; third: string; publicId: string }> }): Promise<Metadata> {
  const { locale, publicId, ...segments } = await routeParams;
  return calculatorMetadata.publicResult(segments, publicId, locale);
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

  if (!session?.data) {
    notFound();
  }

  sessionPathGuard({ session, key: mappedParams.key(segments), group: mappedParams.group(segments) });

  const answers = session.data.answers as Answer[];
  const result = session.data.result as ReturnType<typeof calculateMatches>;

  return <PublicResultPageWithData algorithmMatches={result} answers={answers} segments={segments} />;
}
