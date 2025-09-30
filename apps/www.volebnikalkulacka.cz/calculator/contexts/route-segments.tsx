"use client";

import { createContext, useContext } from "react";

import type { RouteSegments } from "../../lib/routing/route-builders";

const RouteSegmentsContext = createContext<RouteSegments | null>(null);

export function RouteSegmentsProvider({ children, segments }: { children: React.ReactNode; segments: RouteSegments }) {
  return <RouteSegmentsContext.Provider value={segments}>{children}</RouteSegmentsContext.Provider>;
}

export function useRouteSegments(): RouteSegments | null {
  return useContext(RouteSegmentsContext);
}
