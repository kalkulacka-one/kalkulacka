import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";

type WithCondenseOnScrollProps = {
  children: (condensed: boolean) => ReactNode;
  condenseAt?: number;
  uncondenseAt?: number;
};

export function WithCondenseOnScroll({ children, condenseAt = 120, uncondenseAt = 20 }: WithCondenseOnScrollProps) {
  const [condensed, setIsCondensed] = useState(false);

  useLayoutEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          setIsCondensed((prev) => {
            if (prev && scrollY <= uncondenseAt) {
              return false;
            }
            if (!prev && scrollY > condenseAt) {
              return true;
            }
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [condenseAt, uncondenseAt]);

  return <>{children(condensed)}</>;
}
