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
        fillRule="evenodd"
        d="M3.5 20.5v-17h17v17h-17ZM17 11H7v1.5h10V11Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
