export function PercentageIcon(
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
        d="M18 2.1 2.1 18l3.7 3.7 15.9-16L18 2.1zm-10 3c0 1.7-1.4 3-3 3s-2.9-1.3-2.9-3S3.4 2.2 5 2.2s3 1.3 3 2.9zm13.7 13.8c0 1.6-1.3 2.9-2.9 2.9-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9 1.6-.1 2.9 1.2 2.9 2.9z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
