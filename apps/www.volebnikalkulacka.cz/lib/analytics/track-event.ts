// The custom events the calculator flow reports, fired straight through `window.plausible` — installed by the script
// variant loaded in `components/server/plausible.tsx`. The class-name route (`plausibleEvent`) stays for the donate card,
// where the event is a click Plausible can read off the element itself; these fire on outcomes no element carries.

/** The four events, with the props each carries: the calculator's id on every one, and which action completed on the share. */
export type TrackedEvent = {
  "Calculator started": { calculator: string };
  "Calculator completed": { calculator: string };
  "Comparison viewed": { calculator: string };
  "Result shared": { calculator: string; method: "image" | "image-copy" | "image-download" | "link" };
};

declare global {
  interface Window {
    /** Installed by the Plausible script tag itself — absent whenever that script never loaded, which is the only signal this module needs. */
    plausible?: (name: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * Fire a Plausible custom event. A no-op wherever `window.plausible` isn't there to answer — analytics off, the script
 * blocked or still loading, or a server render calling this by mistake — so every call site can fire and forget without
 * checking whether analytics is even on.
 */
export function trackEvent<Name extends keyof TrackedEvent>(name: Name, props: TrackedEvent[Name]): void {
  if (typeof window === "undefined") return;
  window.plausible?.(name, { props });
}
