"use server";

import { prisma } from "@repo/database";
import { PrismaClientKnownRequestError } from "@repo/database/library";
import { type SubscribeBody, subscribeBodySchema } from "../types/subscribe";
import { type EmptyObject, type GenericResponse, resultBasicError, resultSuccess } from "../utils/genericResponse";

export async function subscribe(body: SubscribeBody): Promise<GenericResponse<EmptyObject>> {
  // validation wrapper
  const parsed = subscribeBodySchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return resultBasicError({
      type: "Invalid data",
      code: "not-implemented",
      message: `Validation issue: ${issues}`,
    });
  }
  try {
    await prisma.subscription.create({
      data: {
        email: body.email,
      },
    });
    return resultSuccess({});
  } catch (error) {
    // catching errors wrapper
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return resultBasicError({
        type: "Duplicate email",
        code: "duplicate-email",
        message: "Email already subscribed",
      });
    }
    // error unexpected
    return resultBasicError({
      type: "Unexpected error",
      code: "not-implemented",
      message: "Unexpected error",
    });
  }
}
