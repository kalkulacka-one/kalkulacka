"use client";

import { LinkProvider } from "@kalkulacka-one/design-system/client";

import NextLink from "next/link";
import type { ReactNode } from "react";

export function NextLinkProvider({ children }: { children: ReactNode }) {
  return <LinkProvider component={NextLink}>{children}</LinkProvider>;
}
