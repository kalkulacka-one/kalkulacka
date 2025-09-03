"use client";

import { BottomBar } from "@repo/design-system/client";

import { useBottomBar } from "../../hooks/useBottomBar";

export function BottomBarWrapper() {
  const { leftButton, centerButton, rightButton, stepItems, stepCurrent, stepTotal } = useBottomBar();

  return (
    <BottomBar
      stepItems={stepItems}
      stepCurrent={stepCurrent}
      stepTotal={stepTotal}
      idKey="id"
      statusKey="answerStatus"
      leftButton={leftButton}
      centerButton={centerButton}
      rightButton={rightButton}
    />
  );
}
