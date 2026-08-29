import { HttpError } from "./http-error";

export class JsonParseError extends HttpError {
  constructor() {
    super("Bad Request", 400, "errors/json-parse");
  }
}
