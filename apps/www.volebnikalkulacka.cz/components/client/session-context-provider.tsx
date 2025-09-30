"use client";

import { createContext, type PropsWithChildren, useContext } from "react";

type SessionContextType = {
  sessionId?: string;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionContextProvider({ sessionId, children }: PropsWithChildren<{ sessionId?: string }>) {
  return <SessionContext.Provider value={{ sessionId }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
}
