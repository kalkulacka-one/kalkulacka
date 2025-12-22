import { prisma } from "@kalkulacka-one/database";

import type { NextRequest } from "next/server";

import { HttpError, NotFoundError, UnauthorizedError } from "../../../../../lib/errors";
import { getSessionCookie, getSessionFromRequest } from "../../../../../lib/session";
import { getEmbedNameFromRequest } from "../../../../../lib/session/get-embed-name-from-request";

export async function POST(request: NextRequest, { params }: { params: Promise<{ "calculator-id": string }> }) {
  try {
    const { "calculator-id": calculatorId } = await params;

    const embedName = getEmbedNameFromRequest(request);
    const cookieData = await getSessionCookie({ embedName });
    const sessionId = cookieData?.id || getSessionFromRequest(request);
    if (!sessionId) {
      return new UnauthorizedError("Session required").toResponse();
    }

    const session = await prisma.calculatorSession.findUnique({
      where: {
        sessionId_calculatorId: {
          sessionId,
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

    const ogImageUrl = new URL(`/api/images/sessions/${publicId}/opengraph`, request.url);
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
