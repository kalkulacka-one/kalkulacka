"use client";

import { ErrorPage } from "@kalkulacka-one/app/client";

import { ErrorReporter } from "@/components/client";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <ErrorReporter error={error} />
      <ErrorPage reset={reset} digest={error.digest} compact />
    </>
  );
}
