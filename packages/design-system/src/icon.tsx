import React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";

const iconVariants = cva("", {
  variants: {
    size: {
      small: "w-var(--spacing-small) h-var(--spacing-small);",
      medium: "w-var(--spacing-medium) h-var(--spacing-medium);",
      large: "w-var(--spacing-large) h-var(--spacing-large);",
      "extra-large":
        "w-var(--spacing-extra-large) h-var(--spacing-extra-large);",
      "extra-huge": "w-var(--spacing-extra-huge) h-var(--spacing-extra-huge);",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface IconProps {
  icon: string;
  color?: string;
  size?: "small" | "medium" | "large" | "extra-large" | "extra-huge";
  title?: string;
}

const Icon: React.FC<IconProps> = ({ icon, color, size, title }) => {
  const classes = cn(iconVariants({ size }), "icon");

  return (
    <div className={classes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden={!title}
        viewBox="0 0 24 24"
      >
        {title && <title>{title}</title>}
        <path d={icon} fill={color} />
      </svg>
    </div>
  );
};

export default Icon;
