// Ported from kalkulacka-2026/packages/ui/src/tutorial-step/tutorial-step.tsx and tutorial-step.module.css
import type { ReactNode } from "react";

import { Icon } from "../client/icon";
import type { IconDefinition } from "../icons";

export type TutorialStep = {
  /** The gesture or control being taught — a definition from the icon set, or a raw `@mdi/js` path. */
  icon: IconDefinition | string;
  title: string;
  description: string;
  /** Optional live demonstration — a real card to try the gesture on. */
  children?: ReactNode;
};

/**
 * One thing the tutorial teaches.
 *
 * Reference, not a checklist. The badge used to gain a tick once the gesture
 * had been tried on the practice card, which made the help overlay read as
 * homework — wrong for a surface people open *because* they are stuck. Progress
 * is shown on the card that the practising happens on.
 *
 * An `<li>`: the caller owns the `<ul>` around a run of steps, which is where
 * the rhythm between them is set (the tutorial and the intro's facts list want
 * different gaps).
 */
export function TutorialStep({ icon, title, description, children }: TutorialStep) {
  return (
    <li className="ko:flex ko:items-start ko:gap-4 ko:list-none">
      <span
        className={[
          "ko:relative ko:flex-none ko:flex ko:items-center ko:justify-center ko:size-11",
          "ko:rounded-pill ko:bg-surface ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)] ko:text-text-muted",
          "ko:transition-[background-color,box-shadow,color] ko:duration-[var(--ko-duration-fast)] ko:ease-[ease]",
        ].join(" ")}
      >
        <Icon icon={icon} size="regular" decorative />
      </span>

      <div className="ko:flex ko:flex-col ko:gap-1 ko:min-w-0">
        <p className="ko:m-0 ko:font-sans ko:text-[1.0625rem] ko:font-bold ko:tracking-[-0.01em] ko:text-text-strong">{title}</p>
        <p className="ko:m-0 ko:font-sans ko:text-[0.9375rem] ko:leading-[1.45] ko:text-text-muted">{description}</p>
        {children}
      </div>
    </li>
  );
}
