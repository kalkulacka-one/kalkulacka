"use client";

// Ported from kalkulacka-2026/apps/web/components/help-dialog.tsx
import { Dialog } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { GuideSteps } from "./guide-steps";

export type HelpDialog = {
  open: boolean;
  onClose: () => void;
};

/**
 * The full explanation of the flow's controls, opened from the shell menu on
 * any screen.
 *
 * The guide screen itself is just the practice card, so this is the *only*
 * place the prose lives — `GuideSteps` is its own component precisely so that
 * a second surface wanting the same list gets this one rather than a copy to
 * keep in step.
 */
export function HelpDialog({ open, onClose }: HelpDialog) {
  const t = useTranslations("koa.components.helpDialog");

  return (
    <Dialog open={open} onClose={onClose} title={t("title")} closeLabel={t("close")} size="wide">
      <GuideSteps />
    </Dialog>
  );
}
