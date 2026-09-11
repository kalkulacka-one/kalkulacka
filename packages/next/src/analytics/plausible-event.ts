// Plausible reads custom events off the class list, which works only with the tagged-events script variant loaded in `components/server/plausible.tsx`
export function plausibleEvent(name: string, props: Record<string, string | number> = {}): string {
  // Plausible interprets spaces as separators between tags and encodes them as `+`
  const encode = (value: string | number) => String(value).trim().replace(/\s+/g, "+");

  return [`plausible-event-name=${encode(name)}`, ...Object.entries(props).map(([key, value]) => `plausible-event-${key}=${encode(value)}`)].join(" ");
}
