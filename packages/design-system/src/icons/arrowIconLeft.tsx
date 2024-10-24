export function ArrowIconLeft(
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
        d="M12 19.625L4.375 12L12 4.375L13.075 5.45L7.25 11.25H19.625V12.75H7.25L13.075 18.55L12 19.625Z"
        fill="currentColor"
      />
    </svg>
  );
}
