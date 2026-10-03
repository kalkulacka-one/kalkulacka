import { appsignal } from "@kalkulacka-one/next/monitoring/client";

import { useEffect } from "react";

interface ErrorReporterProps {
  error: Error & { digest?: string };
}

export function ErrorReporter({ error }: ErrorReporterProps) {
  useEffect(() => {
    if (appsignal) {
      appsignal.sendError(error);
    }
  }, [error]);

  return null;
}
