export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly type: string,
    public readonly instance?: string,
    public readonly extensions?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toResponse(): Response {
    const body: Record<string, unknown> = {
      type: this.type,
      title: this.message,
      status: this.statusCode,
    };

    if (this.instance) {
      body.instance = this.instance;
    }

    if (this.extensions) {
      Object.assign(body, this.extensions);
    }

    return new Response(JSON.stringify(body), {
      status: this.statusCode,
      headers: { "Content-Type": "application/problem+json" },
    });
  }
}
