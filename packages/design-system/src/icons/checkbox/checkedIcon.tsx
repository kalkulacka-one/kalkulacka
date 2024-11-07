import React from "react";

export function CheckedIcon(
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
        d="m7.6 12.85 6.725-6.725-1.05-1.05L7.6 10.75 4.75 7.9 3.7 8.95l3.9 3.9Z"
      />
    </svg>
  );
}
