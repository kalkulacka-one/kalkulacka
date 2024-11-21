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
        d="M0.5 0.5V17.5H17.5V0.5H0.5ZM14.325 6.125L7.6 12.85L3.7 8.95L4.75 7.9L7.6 10.75L13.275 5.075L14.325 6.125Z"
      />
    </svg>
  );
}
