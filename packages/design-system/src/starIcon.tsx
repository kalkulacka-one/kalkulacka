export function StarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      {props.children}
      <path
        d="M36.6667 15.4L24.6833 14.3667L20 3.33333L15.3167 14.3833L3.33333 15.4L12.4333 23.2833L9.7 35L20 28.7833L30.3 35L27.5833 23.2833L36.6667 15.4ZM20 25.6667L13.7333 29.45L15.4 22.3167L9.86667 17.5167L17.1667 16.8833L20 10.1667L22.85 16.9L30.15 17.5333L24.6167 22.3333L26.2833 29.4667L20 25.6667Z"
        fill="#565252"
      />
    </svg>
  );
}
