import * as React from "react";

export function HomeIcon(
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
        d="M0 16.875V5.625L7.5 0 15 5.625v11.25H9.425v-6.7h-3.85v6.7H0Zm1.5-1.5h2.575v-6.7h6.85v6.7H13.5v-9l-6-4.5-6 4.5v9Z"
      />
    </svg>
  );
}
