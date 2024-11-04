export function YesIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 24 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {props.children}
      <path
        d="M23.7692 3.74487L20.1247 0.0769196L7.92307 12.3565L3.6446 8.05061L0 11.7185L7.92305 19.6923L23.7692 3.74487Z"
        fill="currentColor"
      />
    </svg>
  );
}
