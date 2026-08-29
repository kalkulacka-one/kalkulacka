"use client";

import Appsignal from "@appsignal/javascript";
import { plugin as network } from "@appsignal/plugin-breadcrumbs-network";
import { plugin as windowEvents } from "@appsignal/plugin-window-events";

const APPSIGNAL_FRONTEND_KEY = process.env.NEXT_PUBLIC_APPSIGNAL_FRONTEND_KEY;

export const appsignal = (() => {
  if (typeof window === "undefined") return null;
  if (!APPSIGNAL_FRONTEND_KEY) return null;

  const revision = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.trim() || "development";

  const instance = new Appsignal({
    key: APPSIGNAL_FRONTEND_KEY,
    namespace: "frontend",
    revision,
  });

  instance.use(windowEvents());
  instance.use(network());

  return instance;
})();
