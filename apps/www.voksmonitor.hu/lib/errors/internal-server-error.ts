import { HttpError } from "./http-error";

export class InternalServerError extends HttpError {
  constructor() {
    super("Internal Server Error", 500, "errors/internal");
  }
}
