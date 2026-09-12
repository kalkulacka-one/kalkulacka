import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

/**
 * Whether the session backend is there.
 *
 * `unknown` until `SessionInitializer`'s first call comes back; `ready` once
 * the sessions endpoint has answered — which is the only honest way to know
 * there is a database behind it. The session cookie's name is configured in
 * `.env` for every checkout, so its presence says nothing about that: a local
 * checkout without a database has the name and no backend, and a "Kopírovat
 * odkaz" gated on the name alone would be a dead button there.
 */
export type SessionStatus = "unknown" | "ready" | "unavailable";

type SessionStatusValue = {
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
};

const SessionStatusContext = createContext<SessionStatusValue | undefined>(undefined);

export function SessionStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("unknown");
  const value = useMemo(() => ({ status, setStatus }), [status]);
  return <SessionStatusContext.Provider value={value}>{children}</SessionStatusContext.Provider>;
}

/** The backend's state, for the screens that offer something only a backend can do. Outside a provider it is simply never `ready`. */
export function useSessionStatus(): SessionStatus {
  return useContext(SessionStatusContext)?.status ?? "unknown";
}

/** The initializer's side: the one place the status is written. */
export function useSetSessionStatus(): (status: SessionStatus) => void {
  return useContext(SessionStatusContext)?.setStatus ?? (() => {});
}
