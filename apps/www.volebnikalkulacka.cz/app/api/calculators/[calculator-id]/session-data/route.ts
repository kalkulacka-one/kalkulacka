import { prisma } from "@kalkulacka-one/database";
import { answerSchema } from "@kalkulacka-one/schema";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { HttpError, InternalServerError, JsonParseError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { getEmbedNameFromRequest, getSessionCookie, getSessionFromRequest } from "@/lib/session/server";

const matchSchema = z.object({
  id: z.string().uuid(),
  match: z.number().min(0).max(100).optional(),
});

const postRequestSchema = z.object({
  answers: z.array(answerSchema),
  matches: z.array(matchSchema).optional(),
  calculatorVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ "calculator-id": string }> }) {
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
      include: {
        data: true,
      },
    });

    if (!session) {
      return new NotFoundError("Session not found for this calculator").toResponse();
    }

    if (!session.data) {
      return new NotFoundError("No session data found for this calculator").toResponse();
    }

    const answers = session.data.answers;
    const result = z.array(answerSchema).safeParse(answers);

    if (!result.success) {
      return new InternalServerError().toResponse();
    }

    let parsedMatches: z.infer<typeof matchSchema>[] | undefined;
    if (session.data.result) {
      const matchesValidation = z.array(matchSchema).safeParse(session.data.result);
      if (!matchesValidation.success) {
        return new InternalServerError().toResponse();
      }
      parsedMatches = matchesValidation.data;
    }

    return Response.json({
      answers: result.data,
      matches: parsedMatches,
      calculatorVersion: session.calculatorVersion,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ "calculator-id": string }> }) {
  try {
    const { "calculator-id": calculatorId } = await params;

    const embedName = getEmbedNameFromRequest(request);
    const cookieData = await getSessionCookie({ embedName });
    const sessionId = cookieData?.id || getSessionFromRequest(request);
    if (!sessionId) {
      return new UnauthorizedError("Session required").toResponse();
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new JsonParseError().toResponse();
    }

    const result = postRequestSchema.safeParse(body);
    if (!result.success) {
      return new ValidationError(result.error).toResponse();
    }
    const parsed = result.data;

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

    const updateData: {
      answers: typeof parsed.answers;
      result?: typeof parsed.matches;
      completedAt?: Date;
    } = {
      answers: parsed.answers,
    };

    if (parsed.matches) {
      updateData.result = parsed.matches;
      updateData.completedAt = new Date();
    }

    await prisma.$transaction(async (tx) => {
      if (parsed.calculatorVersion) {
        await tx.calculatorSession.update({
          where: { id: session.id },
          data: { calculatorVersion: parsed.calculatorVersion },
        });
      }

      await tx.calculatorSessionData.upsert({
        where: {
          sessionId: session.id,
        },
        update: updateData,
        create: {
          sessionId: session.id,
          answers: parsed.answers,
          result: parsed.matches,
          completedAt: parsed.matches ? new Date() : null,
        },
      });
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
