"use server";

import { prisma } from "@repo/database";
import { SubscribeBody } from "../types/subscribe";
import {
  EmptyObject,
  GenericResponse,
  resultBasicError,
} from "../utils/genericResponse";

export async function subscribe(
  body: SubscribeBody,
): Promise<GenericResponse<EmptyObject>> {
  // Pridat validaci

  // we save the email to database
  // TODO: this fails when the email exists, we need a helper function that catches error and turn the response to GenericResponse<>
  await prisma.subscription.create({
    data: {
      email: body.email,
    },
  });

  return resultBasicError({
    type: "error",
    code: "not-implemented",
    message: "Not implemented",
  });
}
