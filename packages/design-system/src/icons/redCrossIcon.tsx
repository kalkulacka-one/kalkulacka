export function RedCrossIcon(
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
        data-v-a3e5008d=""
        d="m21.692 5.745-3.624-3.668L12 8.217l-6.068-6.14-3.624 3.668 6.067 6.14-6.067 6.14 3.624 3.667L12 15.552l6.067 6.14 3.625-3.668-6.067-6.14 6.067-6.14Z"
        fill="var(--secondary-50)"
      ></path>
    </svg>
  );
}
