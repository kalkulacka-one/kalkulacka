"use client";

import { ErrorReporter } from "@/components/client";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorReporter error={error} />;
}
