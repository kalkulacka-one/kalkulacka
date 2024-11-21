import React from "react";

export function EmptyCheckBoxIcon(
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
      <path fill="currentColor" d="M.5 17.5V.5h17v17H.5ZM2 16h14V2H2v14Z" />
    </svg>
  );
}
