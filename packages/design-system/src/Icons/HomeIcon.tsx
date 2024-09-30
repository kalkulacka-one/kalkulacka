import { SVGProps } from "react";
const HomeIconComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4 20.875V9.625L11.5 4 19 9.625v11.25h-5.575v-6.7h-3.85v6.7H4Zm1.5-1.5h2.575v-6.7h6.85v6.7H17.5v-9l-6-4.5-6 4.5v9Z"
    />
  </svg>
);
export default HomeIconComponent;
