import { prisma } from "@repo/database";
import type { NextRequest } from "next/server";

import { HttpError, NotFoundError, UnauthorizedError } from "../../../../../lib/errors";
import { getSessionCookie } from "../../../../../lib/session";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ "calculator-id": string }> }) {
  try {
    const { "calculator-id": calculatorId } = await params;

    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) {
      return new UnauthorizedError("Session required").toResponse();
    }

    const session = await prisma.calculatorSession.findUnique({
      where: {
        sessionId_calculatorId: {
          sessionId: sessionCookie.id,
          calculatorId,
        },
      },
    });

    if (!session) {
      return new NotFoundError("Session not found for this calculator").toResponse();
    }

    if (session.publicId) {
      return Response.json({
        publicId: session.publicId,
      });
    }

    const publicId = crypto.randomUUID();

    await prisma.calculatorSession.update({
      where: {
        id: session.id,
      },
      data: {
        publicId,
      },
    });

    const ogImageUrl = new URL(`/api/images/sessions/${publicId}/opengraph`, _request.url);
    void fetch(ogImageUrl.toString()).catch(() => {});

    return Response.json({
      publicId,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
