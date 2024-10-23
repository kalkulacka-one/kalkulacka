import * as React from "react";

export function ErrorIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      {props.children}
      <path
        fill="currentColor"
        d="M.25 11.667 7 0l6.75 11.667H.25ZM6.5 8.133h1V4.8h-1v3.333ZM7 9.867a.52.52 0 0 0 .383-.15c.1-.1.15-.228.15-.384a.52.52 0 0 0-.15-.383A.52.52 0 0 0 7 8.8a.52.52 0 0 0-.383.15.52.52 0 0 0-.15.383c0 .156.05.284.15.384.1.1.227.15.383.15Zm-5.033.8h10.066L7 2l-5.033 8.667Z"
      />
    </svg>
  );
}
