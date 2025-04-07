"use client";
import { CloseIcon } from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";

export default function ReturnHomeButton() {
  return (
    <Link href="/">
      <Button
        fitContent
        kind="link"
        size="auto"
        icon={CloseIcon}
        hasIcon
        iconPosition="right"
      >
        <span className="hidden sm:inline">Zpět na hlavní stránku</span>
      </Button>
    </Link>
  );
}
