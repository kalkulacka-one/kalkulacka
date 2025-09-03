import type { IconProps } from "./types";

export function XIcon({ className, title, titleId, decorative = true, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? "true" : undefined}
      aria-labelledby={!decorative && titleId ? titleId : undefined}
      role={!decorative ? "img" : undefined}
      {...props}
    >
      {title && !decorative && <title id={titleId}>{title}</title>}
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
