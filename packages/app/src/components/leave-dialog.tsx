"use client";

// Ported from the leave dialog inlined in kalkulacka-2026/apps/web/components/app-menu.tsx
import { Button, Dialog } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

export type LeaveDialog = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * "Leave the calculator?" — asked not because leaving is destructive but
 * because the answer is reassuring: the moment someone worries about losing
 * their progress is exactly the moment to tell them it is saved.
 *
 * The reassurance is this platform's, not 2026's: answers here are kept in
 * the server session the app opens for the browser, not only in the browser
 * itself, so the wording promises a return in the same browser and warns
 * about the one place that promise breaks — a private window, whose session
 * goes with it.
 */
export function LeaveDialog({ open, onClose, onConfirm }: LeaveDialog) {
  const t = useTranslations("koa.components.leaveDialog");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
      closeLabel={t("close")}
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="solid" color="neutral" onClick={onConfirm}>
            {t("confirm")}
          </Button>
        </>
      }
    />
  );
}
