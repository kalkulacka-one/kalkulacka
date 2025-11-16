"use client";

import { ErrorReporter } from "../../components/client/error-reporter";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
  return (
    <>
      <ErrorReporter error={error} />
      {(() => {
        throw error;
      })()}
    </>
  );
}
