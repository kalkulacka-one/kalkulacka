import { prisma } from "@kalkulacka-one/database";

import type { NextRequest } from "next/server";
import { z } from "zod";

import { HttpError, JsonParseError, ValidationError } from "../../../lib/errors";

const postRequestSchema = z.object({
  calculatorId: z.string().uuid(),
  calculatorKey: z.string(),
  helpfulness: z.number().int().min(1).max(5),
});

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

    await prisma.feedbackSurveyResponse.create({
      data: {
        calculatorId: parsed.calculatorId,
        calculatorKey: parsed.calculatorKey,
        helpfulness: parsed.helpfulness,
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
