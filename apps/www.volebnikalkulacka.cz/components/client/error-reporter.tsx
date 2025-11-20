import { useEffect } from "react";

import { appsignal } from "@/lib/monitoring";

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
