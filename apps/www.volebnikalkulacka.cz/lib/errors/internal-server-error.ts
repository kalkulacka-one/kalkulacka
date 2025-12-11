import { HttpError } from "./http-error";

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(message, 500, "errors/internal");
  }
}
