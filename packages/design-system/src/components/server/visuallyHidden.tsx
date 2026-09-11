// Ported from kalkulacka-2026/packages/ui/src/visually-hidden/visually-hidden.tsx and visually-hidden.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

export type VisuallyHidden = {
  children: React.ReactNode;
  /** Use `output`/`div` when the content also needs to be a live region. */
  as?: React.ElementType;
  "aria-live"?: "polite" | "assertive";
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "aria-live" | "children" | "className">;

/**
 * Available to assistive tech, invisible on screen.
 *
 * `ko:sr-only` clips the element down to a pixel rather than `display: none` —
 * the latter removes the text from the accessibility tree entirely, which
 * defeats the point.
 */
export function VisuallyHidden({ children, as: Component = "span", className, ...rest }: VisuallyHidden) {
  return (
    <Component className={twMerge("ko:sr-only", className)} {...rest}>
      {children}
    </Component>
  );
}
