"use client";

import type { ReactNode } from "react";

export interface BackgroundProps {
  children: ReactNode;
  hasBlobs?: boolean;
  blobsHeight?: string;
  redBlobX?: string;
  redBlobY?: string;
  blueBlobX?: string;
  blueBlobY?: string;
}

export function Background({ children, hasBlobs = true, blueBlobX = "5%", blueBlobY = "10%", redBlobX = "50%", redBlobY = "20%", blobsHeight = "80%" }: BackgroundProps) {
  return (
    <div className="relative w-full h-full grid">
      {hasBlobs && (
        <div className="fixed w-full h-full z-[-1]">
          <img
            src="/background/blue-blob.svg"
            alt=""
            className="fixed"
            style={{
              height: blobsHeight,
              left: blueBlobX,
              top: blueBlobY,
              filter: "blur(120px)",
            }}
          />
          <img
            src="/background/red-blob.svg"
            alt=""
            className="fixed"
            style={{
              height: blobsHeight,
              left: redBlobX,
              top: redBlobY,
              filter: "blur(120px)",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
