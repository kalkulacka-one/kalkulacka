"use client";

// Ported from kalkulacka-2026/apps/web/components/restart-dialog.tsx
import { Button, Dialog } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

export type RestartDialog = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * "Are you sure?" for the one action in the app that destroys work.
 *
 * Shared rather than written at each call site because there are two ways to
 * reach it — the shell menu and the calculator's front door — and a
 * confirmation that words the consequence differently depending on which
 * button you came from is a confirmation nobody can trust.
 */
export function RestartDialog({ open, onClose, onConfirm }: RestartDialog) {
  const t = useTranslations("koa.components.restartDialog");

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
