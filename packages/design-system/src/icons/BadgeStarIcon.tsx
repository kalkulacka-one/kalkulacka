import React from "react";

export function BadgeStarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      {props.children}
      <path
        fill="currentColor"
        d="M9 12.953l4.635 2.797-1.23-5.273L16.5 6.93l-5.393-.457L9 1.5 6.893 6.473 1.5 6.93l4.095 3.547-1.23 5.273L9 12.953z"
      ></path>
    </svg>
  );
}
