import { HttpError } from "./http-error";

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "errors/unauthorized");
  }
}
