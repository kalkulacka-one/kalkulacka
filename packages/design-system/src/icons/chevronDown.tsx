import * as React from "react";

export function ChevronDownIcon(
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
        fill="#565252"
        d="M6 7.05.35 1.375 1.4.325l4.6 4.6 4.6-4.6 1.05 1.05L6 7.05Z"
      />
    </svg>
  );
}
