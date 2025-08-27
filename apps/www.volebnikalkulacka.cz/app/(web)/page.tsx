import { SpanStatusCode, trace } from "@opentelemetry/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volební kalkulačka",
  description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
};

export default async function Page() {
  // Log a handled error to AppSignal (no throw)
  await logSoftError("Manual test error", { where: "app/(web)/page.tsx" });

  return (
    <section>
      <h2>Parlamentní volby 2025</h2>
      <p>Soft error was logged to AppSignal.</p>
    </section>
  );
}

// ----- helper kept in the same file for your sanity; move to /lib if you like
async function logSoftError(message: string, extra?: Record<string, unknown>) {
  const tracer = trace.getTracer("soft-error");

  // startActiveSpan sets up context for us; end() guarantees exporter flush
  await new Promise<void>((resolve) => {
    tracer.startActiveSpan("soft-error", (span) => {
      try {
        span.addEvent("exception", {
          "exception.type": "SoftError",
          "exception.message": message,
          "exception.stacktrace": "", // provide a stack if you have one
          "exception.escaped": false, // handled
          ...flatten(extra),
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message });
      } finally {
        span.end();
        resolve();
      }
    });
  });
}

function flatten(obj?: Record<string, unknown>, prefix = ""): Record<string, string> {
  if (!obj) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}
