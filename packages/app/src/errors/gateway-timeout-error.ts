import { HttpError } from "./http-error";

/** An upstream this route fronts did not answer within the time it was given. */
export class GatewayTimeoutError extends HttpError {
  constructor(message = "Gateway Timeout") {
    super(message, 504, "errors/gateway-timeout");
  }
}
