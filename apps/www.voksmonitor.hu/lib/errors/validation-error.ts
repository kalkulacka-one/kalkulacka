import type { ZodError } from "zod";

import { HttpError } from "./http-error";

export class ValidationError extends HttpError {
  constructor(zodError: ZodError) {
    const errors = zodError.issues.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    super("Bad Request", 400, "errors/validation", undefined, { errors });
  }
}
