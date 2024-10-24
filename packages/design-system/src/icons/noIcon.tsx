export function NoIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {props.children}
      <path
        d="M19.6923 3.74488L16.0676 0.0769413L9.99998 6.21671L3.93243 0.0769043L0.307678 3.74482L6.3752 9.8846L0.307678 16.0243L3.93241 19.6922L9.99995 13.5525L16.0675 19.6923L19.6922 16.0244L13.6247 9.88463L19.6923 3.74488Z"
        fill="currentColor"
      />
    </svg>
  );
}
