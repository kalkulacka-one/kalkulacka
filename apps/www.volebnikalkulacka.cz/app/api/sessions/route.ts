import type { NextRequest } from "next/server";
import { z } from "zod";

import { HttpError, JsonParseError, ValidationError } from "../../../lib/errors";
import { type CreateCalculatorSessionParams, calculatorFullKey, createCalculatorSession, getSessionCookie, type SessionCookie, setSessionCookie } from "../../../lib/session";

const postRequestSchema = z.object({
  calculatorId: z.string().uuid(),
  calculatorKey: z.string(),
  calculatorGroup: z.string().optional(),
  embedName: z.string().optional(),
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

    const fullKey = calculatorFullKey(parsed);
    const existingCookieData = await getSessionCookie(parsed);

    if (existingCookieData) {
      await handleExistingSession(existingCookieData, fullKey, parsed);
    } else {
      await handleNewSession(fullKey, parsed);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}

async function handleExistingSession(cookieData: SessionCookie, fullKey: string, params: CreateCalculatorSessionParams) {
  if (!cookieData.calculators.includes(fullKey)) {
    cookieData.calculators.push(fullKey);
    await setSessionCookie({ ...params, sessionCookie: cookieData });
    await createCalculatorSession({ ...params, sessionId: cookieData.id });
  }
}

async function handleNewSession(fullKey: string, params: CreateCalculatorSessionParams) {
  const session = await createCalculatorSession(params);
  const cookieData = {
    id: session.sessionId,
    calculators: [fullKey],
  };
  await setSessionCookie({ ...params, sessionCookie: cookieData });
}
