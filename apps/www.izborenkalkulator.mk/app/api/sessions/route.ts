import { HttpError, JsonParseError, UnauthorizedError, ValidationError } from "@kalkulacka-one/app";

import type { NextRequest } from "next/server";
import { z } from "zod";

import {
  type CreateCalculatorSessionParams,
  createCalculatorSession,
  getEmbedNameFromRequest,
  getSessionCookie,
  getSessionFromRequest,
  type SessionCookie,
  setSessionCookie,
} from "@/lib/session/server";
import { calculatorFullKey } from "@/lib/session/shared";

const postRequestSchema = z.object({
  calculatorId: z.string().uuid(),
  calculatorKey: z.string(),
  calculatorGroup: z.string().optional(),
  calculatorVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional(),
  embedName: z.string().optional(),
});

type SessionResponse = {
  sessionId: string;
};

export async function GET(request: NextRequest) {
  try {
    const embedName = getEmbedNameFromRequest(request);
    const cookieData = await getSessionCookie({ embedName });
    const sessionId = cookieData?.id || getSessionFromRequest(request);

    if (!sessionId) {
      return new UnauthorizedError("Session required").toResponse();
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}

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

    const databaseInitializedAt = process.env.DATABASE_INITIALIZED_AT ? new Date(process.env.DATABASE_INITIALIZED_AT) : new Date(0);
    const cookieCreatedAt = existingCookieData?.createdAt ? new Date(existingCookieData.createdAt) : null;
    const isCookieStale = existingCookieData && (!cookieCreatedAt || cookieCreatedAt < databaseInitializedAt);

    let sessionResponse: SessionResponse;
    if (existingCookieData && !isCookieStale) {
      sessionResponse = await handleExistingSession(existingCookieData, fullKey, parsed);
    } else {
      sessionResponse = await handleNewSession(fullKey, parsed);
    }

    return Response.json(sessionResponse, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}

async function handleExistingSession(cookieData: SessionCookie, fullKey: string, params: CreateCalculatorSessionParams): Promise<SessionResponse> {
  if (!cookieData.calculators.includes(fullKey)) {
    cookieData.calculators.push(fullKey);
    await setSessionCookie({ sessionCookie: cookieData, embedName: params.embedName });
    await createCalculatorSession({ ...params, sessionId: cookieData.id });
  }
  return { sessionId: cookieData.id };
}

async function handleNewSession(fullKey: string, params: CreateCalculatorSessionParams): Promise<SessionResponse> {
  const session = await createCalculatorSession(params);
  const cookieData = {
    id: session.sessionId,
    calculators: [fullKey],
    createdAt: session.createdAt.toISOString(),
  };
  await setSessionCookie({ sessionCookie: cookieData, embedName: params.embedName });
  return { sessionId: session.sessionId };
}
