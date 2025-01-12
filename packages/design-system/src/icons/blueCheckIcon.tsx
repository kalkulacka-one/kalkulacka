export function BlueCheckIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {props.children}
      <path
        d="m23.77 5.745-3.645-3.668-12.202 12.28-4.278-4.306L0 13.719l7.923 7.973L23.77 5.745Z"
        fill="var(--primary-50)"
      ></path>
    </svg>
  );
}
