"use client";

import { mdiArrowLeft } from "@mdi/js";
import { Button, Icon, Logo } from "@repo/design-system/client";
import React, { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";

import { useCalculatorViewModel } from "../../view-models";

type AppHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function AppHeader({ children, className }: AppHeaderProps) {
  const [isCondensed, setIsCondensed] = useState(false);

  useLayoutEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsCondensed(prev => {
            // Balanced thresholds to prevent oscillation (76px height difference)
            if (prev && scrollY <= 45) {
              return false; // Uncondense when scrolled back up
            } else if (!prev && scrollY > 120) {
              return true; // Condense when scrolled down
            }
            return prev; // Keep current state
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasPageHeading = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type === AppHeaderBottomMain || child.type === AppHeaderBottomLeft)
  );

  return (
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-200 ${className || ""}`}>
      <div className="px-4 py-4">
        <div 
          className="grid gap-x-4 gap-y-4 items-center"
          style={{
            gridTemplateAreas: (hasPageHeading && !isCondensed) 
              ? `"left logo main right"
                 "bottom-left bottom-left bottom-main bottom-right"`
              : `"left logo main right"`,
            gridTemplateColumns: "max-content max-content 1fr max-content",
            gridTemplateRows: (hasPageHeading && !isCondensed) ? "auto auto" : "auto"
          }}
        >
          <div style={{ 
            gridArea: !isCondensed ? "left" : "logo",
            gridColumnStart: (!hasPageHeading && !isCondensed) ? 1 : undefined,
            gridColumnEnd: (!hasPageHeading && !isCondensed) ? 3 : undefined,
            transition: "all 200ms ease"
          }}>
            <Logo title="Volební kalkulačka" size="medium" />
          </div>
          {React.Children.map(children, (child) =>
            React.isValidElement(child) ? React.cloneElement(child, { isCondensed } as any) : child
          )}
        </div>
      </div>
    </header>
  );
}

type AppHeaderLeftProps = {
  children?: ReactNode;
  isCondensed?: boolean;
};

export function AppHeaderLeft({ children, isCondensed }: AppHeaderLeftProps) {
  return (
    <div style={{ gridArea: "left", opacity: isCondensed ? 1 : 0, transition: "opacity 200ms", pointerEvents: isCondensed ? 'auto' : 'none' }}>
      {children}
    </div>
  );
}

type AppHeaderMainProps = {
  children?: ReactNode;
  isCondensed?: boolean;
};

export function AppHeaderMain({ children, isCondensed }: AppHeaderMainProps) {
  const calculator = useCalculatorViewModel();
  
  return (
    <div 
      style={{ 
        gridArea: "main",
        transition: "all 200ms ease"
      }} 
      className="grid text-sm gap-y-0 leading-none"
    >
      <div className="font-light text-neutral-600 leading-none">Volební kalkulačka</div>
      <div className="leading-none">
        {children || (
          <div className="text-sm">
            <span className="font-semibold">{(calculator as any)?.shortTitle || calculator?.title || "Calculator"}</span>
            <span className="font-light"> • Sněmovní volby 2025</span>
          </div>
        )}
      </div>
    </div>
  );
}

type AppHeaderRightProps = {
  children: ReactNode;
};

export function AppHeaderRight({ children }: AppHeaderRightProps) {
  return <div style={{ gridArea: "right" }}>{children}</div>;
}

type AppHeaderBottomLeftProps = {
  children: ReactNode;
  isCondensed?: boolean;
};

export function AppHeaderBottomLeft({ children, isCondensed }: AppHeaderBottomLeftProps) {
  return (
    <div style={{ 
      gridArea: isCondensed ? "left" : "bottom-left",
      transition: "all 200ms ease",
      justifySelf: isCondensed ? "start" : "end"
    }}>
      {children}
    </div>
  );
}

type AppHeaderBottomMainProps = {
  children: ReactNode;
  isCondensed?: boolean;
};

export function AppHeaderBottomMain({ children, isCondensed }: AppHeaderBottomMainProps) {
  return (
    <div
      style={{ gridArea: "bottom-main", display: isCondensed ? "none" : "block" }}
      className="text-[26px] font-bold leading-none py-4"
    >
      {children}
    </div>
  );
}


