"use client";

// Ported from kalkulacka-2026/apps/web/components/app-menu.tsx
import { Menu, type MenuItem } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useColorMode } from "@/client/hooks";

import { HelpDialog } from "./help-dialog";
import { LeaveDialog } from "./leave-dialog";
import { RestartDialog } from "./restart-dialog";

export type AppMenu = {
  /**
   * A screen that only *shows* a calculator rather than being inside one —
   * the public shared result. The menu drops "Začít znovu" and "Opustit
   * kalkulačku": both act on the viewer's own answers and progress, and that
   * page is somebody else's result.
   */
  readOnly?: boolean;
  /**
   * Inside a partner iframe. "Opustit kalkulačku" disappears: it navigates to
   * the homepage, and doing that *inside the iframe* strands the visitor in a
   * frame of the wrong site — the way out of an embed is the attribution link
   * in the header, which opens a new tab. Help and restart stay.
   */
  embed?: boolean;
  /**
   * False when the active theme is single-mode (partner brand themes are) —
   * the toggle would visibly do nothing there. The app decides, since it is
   * the app that knows which theme an embed runs under.
   */
  colorModeToggle?: boolean;
  /** Confirmed "Začít znovu": the app clears the answers and returns to the first question. */
  onRestart: () => void;
  /** Confirmed "Opustit kalkulačku": the app saves and leaves for its homepage. */
  onLeave: () => void;
};

/** Which dialog, if any, is up. Only one can be, so this is a mode, not flags. */
type OpenDialog = "none" | "help" | "restart" | "leave";

/**
 * The menu in the corner of every screen.
 *
 * Restarting is the one genuinely destructive thing in the app, so it is the
 * one thing here that asks first. Leaving asks too, but for the opposite
 * reason: the answer is reassuring, and the moment someone worries about
 * losing their progress is exactly the moment to tell them it is saved.
 *
 * The routes and the store are the app's, so the two consequential actions
 * arrive as callbacks; the menu only owns the asking.
 */
export function AppMenu({ readOnly = false, embed = false, colorModeToggle = true, onRestart, onLeave }: AppMenu) {
  const t = useTranslations("koa.components.appMenu");
  const [dialog, setDialog] = useState<OpenDialog>("none");
  const [colorMode, toggleColorMode] = useColorMode();

  const close = () => setDialog("none");

  const items: MenuItem[] = [
    {
      id: "help",
      label: t("help"),
      detail: t("helpDetail"),
      icon: icons.info,
      onSelect: () => setDialog("help"),
    },
    // Labelled by what it switches *to*, matching every other item's
    // imperative phrasing — so the icon and label always describe the mode
    // one click away, not the one currently showing.
    ...(colorModeToggle
      ? [
          colorMode === "dark"
            ? {
                id: "color-mode",
                label: t("lightMode"),
                detail: t("lightModeDetail"),
                icon: icons.sun,
                onSelect: toggleColorMode,
              }
            : {
                id: "color-mode",
                label: t("darkMode"),
                detail: t("darkModeDetail"),
                icon: icons.moon,
                onSelect: toggleColorMode,
              },
        ]
      : []),
    ...(readOnly
      ? []
      : ([
          {
            id: "restart",
            label: t("restart"),
            detail: t("restartDetail"),
            icon: icons.restart,
            onSelect: () => setDialog("restart"),
          },
          ...(embed
            ? []
            : ([
                {
                  id: "leave",
                  label: t("leave"),
                  detail: t("leaveDetail"),
                  icon: icons.exit,
                  onSelect: () => setDialog("leave"),
                },
              ] satisfies MenuItem[])),
        ] satisfies MenuItem[])),
  ];

  return (
    <>
      <Menu label={t("label")} items={items} />

      <HelpDialog open={dialog === "help"} onClose={close} />

      <RestartDialog
        open={dialog === "restart"}
        onClose={close}
        onConfirm={() => {
          close();
          onRestart();
        }}
      />

      <LeaveDialog
        open={dialog === "leave"}
        onClose={close}
        onConfirm={() => {
          close();
          onLeave();
        }}
      />
    </>
  );
}
