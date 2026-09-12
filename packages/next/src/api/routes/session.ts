import { HttpError, NotFoundError } from "@kalkulacka-one/app";
import { prisma } from "@kalkulacka-one/database";

import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ "public-id": string }> }) {
  try {
    const { "public-id": publicId } = await params;

    const session = await prisma.calculatorSession.findUnique({
      where: { publicId },
      include: { data: true },
    });

    if (!session) {
      return new NotFoundError("Session not found").toResponse();
    }

    if (!session.data) {
      return new NotFoundError("No session data found").toResponse();
    }

    return Response.json({
      publicId: session.publicId,
      calculatorId: session.calculatorId,
      calculatorKey: session.calculatorKey,
      calculatorGroup: session.calculatorGroup,
      calculatorVersion: session.calculatorVersion,
      answers: session.data.answers,
      matches: session.data.result,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
