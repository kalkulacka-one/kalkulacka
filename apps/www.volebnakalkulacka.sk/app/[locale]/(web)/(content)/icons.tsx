"use client";

import type * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

// The circle uses currentColor so we can color via Tailwind (e.g., text-blue-500)
export function BeadCheckBlue({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <title>Áno</title>
      <circle cx="37.5" cy="37.5" r="37.5" fill="currentColor" />
      <path d="M55.8894 27.7263L50.1948 21.9951L31.1298 41.1819L24.4447 34.454L18.75 40.1852L31.1298 52.6442L36.8244 46.913L55.8894 27.7263Z" fill="white" />
    </svg>
  );
}

export function BeadCrossRed({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <title>Nie</title>
      <circle cx="37.5" cy="37.5" r="37.5" fill="currentColor" />
      <path
        d="M52.645 27.7263L46.9814 21.9952L37.5008 31.5886L28.0202 21.9951L22.3566 27.7262L31.8371 37.3196L22.3566 46.9129L28.0202 52.6441L37.5007 43.0508L46.9812 52.6442L52.6449 46.913L43.1645 37.3197L52.645 27.7263Z"
        fill="white"
      />
    </svg>
  );
}

export function BeadTickSlate({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <title>Neviem</title>
      <circle cx="37.5" cy="37.5" r="37.5" fill="currentColor" />
      <path d="M46.9134 21.9962L21.9954 46.9141L27.7265 52.6452L52.6445 27.7274L46.9134 21.9962Z" fill="white" />
    </svg>
  );
}
