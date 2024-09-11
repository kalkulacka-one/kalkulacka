import * as React from "react";
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import cn from "classnames";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  ({ items, className }, ref) => (
    <MuiBreadcrumbs
      ref={ref}
      separator="-"
      aria-label="breadcrumb"
      className={cn("", className)}
    >
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <span key={item.href}>{item.label}</span>
        ) : (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ),
      )}
    </MuiBreadcrumbs>
  ),
);

Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
