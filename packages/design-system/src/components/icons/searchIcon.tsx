type SearchIcon = {
  title?: string;
  titleId?: string;
  decorative?: boolean;
} & React.JSX.IntrinsicAttributes &
  React.SVGProps<SVGSVGElement>;

export function SearchIcon({ title, titleId, decorative, ...props }: SearchIcon) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor" {...props}>
      {title && !decorative && <title id={titleId}>{title}</title>}
      <path
        fill="currentColor"
        d="m16.55 17.575-6.3-6.275c-.5.417-1.075.742-1.725.975-.65.233-1.317.35-2 .35-1.717 0-3.167-.592-4.35-1.775C.992 9.667.4 8.217.4 6.5c0-1.7.592-3.146 1.775-4.338C3.358.971 4.808.375 6.525.375c1.7 0 3.142.592 4.325 1.775 1.183 1.183 1.775 2.633 1.775 4.35 0 .717-.117 1.4-.35 2.05a5.612 5.612 0 0 1-.95 1.7l6.275 6.275-1.05 1.05Zm-10.025-6.45c1.283 0 2.371-.45 3.263-1.35.891-.9 1.337-1.992 1.337-3.275s-.446-2.375-1.337-3.275c-.892-.9-1.98-1.35-3.263-1.35-1.3 0-2.396.45-3.287 1.35C2.346 4.125 1.9 5.217 1.9 6.5s.446 2.375 1.338 3.275c.891.9 1.987 1.35 3.287 1.35Z"
      />
    </svg>
  );
}
