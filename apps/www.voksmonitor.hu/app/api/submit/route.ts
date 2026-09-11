import { Prisma, prisma } from "@kalkulacka-one/database";
import { answerSchema } from "@kalkulacka-one/schema";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { HttpError, JsonParseError, ValidationError } from "../../../lib/errors";

const matchSchema = z.object({
  id: z.string().uuid(),
  match: z.number().min(0).max(100).optional(),
});

const demographySchema = z
  .object({
    gender: z.string().optional(),
    age: z.string().optional(),
    residence: z.string().optional(),
    education: z.string().optional(),
    wouldVote: z.string().optional(),
  })
  .optional();

const postRequestSchema = z.object({
  calculatorId: z.string().uuid(),
  calculatorKey: z.string(),
  calculatorGroup: z.string().optional(),
  calculatorVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional(),
  answers: z.array(answerSchema),
  matches: z.array(matchSchema).optional(),
  demography: demographySchema,
});

/**
 * Anonymous submission endpoint.
 *
 * Receives calculator answers and optional demography data in a single POST
 * with no session cookie, no bearer token, and no identifying information.
 * Data is stored with no way to link it back to the submitter.
 */
export async function POST(request: NextRequest) {
  try {
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

    await prisma.$transaction(async (tx) => {
      // Create a standalone calculator session (no sessionId linking)
      const session = await tx.calculatorSession.create({
        data: {
          calculatorId: parsed.calculatorId,
          calculatorKey: parsed.calculatorKey,
          calculatorGroup: parsed.calculatorGroup ?? null,
          calculatorVersion: parsed.calculatorVersion ?? null,
          embedName: null,
        },
      });

      // Store the answers and result
      await tx.calculatorSessionData.create({
        data: {
          sessionId: session.id,
          answers: parsed.answers,
          result: parsed.matches ? (parsed.matches as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
          completedAt: parsed.matches ? new Date() : null,
        },
      });

      // Store demography data if provided (no session link — uses its own random UUID)
      if (parsed.demography) {
        const d = parsed.demography;
        const hasAnyAnswer = Object.values(d).some((v) => v !== undefined);

        if (hasAnyAnswer) {
          await tx.demographySurveyResponse.create({
            data: {
              sessionId: session.id,
              calculatorId: parsed.calculatorId,
              calculatorKey: parsed.calculatorKey,
              gender: d.gender ?? null,
              age: d.age ?? null,
              residence: d.residence ?? null,
              education: d.education ?? null,
              wouldVote: d.wouldVote ?? null,
            },
          });
        }
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
