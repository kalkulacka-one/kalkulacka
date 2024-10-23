import React from "react";

export function ClearIcon(
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
        d="M1.4 13.65.35 12.6 5.95 7 .35 1.4 1.4.35 7 5.95l5.6-5.6 1.05 1.05L8.05 7l5.6 5.6-1.05 1.05L7 8.05l-5.6 5.6Z"
      />
    </svg>
  );
}
