import { HttpError } from "./http-error";

/** An upstream this route fronts (the data CDN, for the asset proxy) answered badly or not at all. */
export class BadGatewayError extends HttpError {
  constructor(message = "Bad Gateway") {
    super(message, 502, "errors/bad-gateway");
  }
}
