import React from "react";

export function InterdermineIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
        d="M0.5 17.5V0.5H17.5V17.5H0.5ZM14 8H4V9.5H14V8Z"
      />
    </svg>
  );
}
