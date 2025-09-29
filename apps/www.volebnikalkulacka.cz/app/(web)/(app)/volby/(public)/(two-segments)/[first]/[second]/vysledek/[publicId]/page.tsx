import { prisma } from "@repo/database";
import { notFound } from "next/navigation";

import type { Answer } from "../../../../../../../../../../../../packages/schema/schemas/answer.schema";
import type { calculateMatches } from "../../../../../../../../../../calculator/lib/result-calculation/calculate-matches";
import { PublicResultPageWithData } from "../../../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; publicId: string }> }) {
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
