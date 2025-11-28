import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(message: string = "Not Found") {
    super(message, 404, "errors/not-found");
  }
}
