import { prisma } from "@repo/database";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { answerSchema } from "../../../../../../../packages/schema/schemas/answer.schema";
import { HttpError, InternalServerError, JsonParseError, NotFoundError, UnauthorizedError, ValidationError } from "../../../../../lib/errors";
import { getSessionCookie } from "../../../../../lib/session";

const matchSchema = z.object({
  id: z.string().uuid(),
  match: z.number().min(0).max(100).optional(),
});

const postRequestSchema = z.object({
  answers: z.array(answerSchema),
  matches: z.array(matchSchema).optional(),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ "calculator-id": string }> }) {
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

    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) {
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
          sessionId: sessionCookie.id,
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

    await prisma.calculatorSessionData.upsert({
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

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
