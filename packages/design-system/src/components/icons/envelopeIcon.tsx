type EnvelopeIcon = {
  title?: string;
  titleId?: string;
  decorative?: boolean;
} & React.JSX.IntrinsicAttributes &
  React.SVGProps<SVGSVGElement>;

export function EnvelopeIcon({ title, titleId, decorative, ...props }: EnvelopeIcon) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      {title && !decorative && <title id={titleId}>{title}</title>}
      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" fill="currentColor" />
    </svg>
  );
}
