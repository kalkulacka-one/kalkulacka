type LogoSvg = {
  title?: string;
  titleId?: string;
  decorative?: boolean;
} & React.JSX.IntrinsicAttributes &
  React.SVGProps<SVGSVGElement>;

export function LogoSvg({ title, titleId, decorative, ...props }: LogoSvg) {
  return (
    <svg viewBox="0 0 300 65" role="img" xmlns="http://www.w3.org/2000/svg" aria-hidden={decorative ? "true" : "false"} {...props}>
      {title && !decorative && <title id={titleId}>{title}</title>}
      <path d="M65.9601 0.28401L77.9054 12.248L37.9138 52.3008L25.9684 64.2647L0 38.2562L11.9454 26.2923L25.9684 40.337L65.9601 0.28401Z" fill="currentColor" className="ko:text-logo-check" />
      <path d="M126.768 0.283997L74.8308 52.3007L86.7762 64.2647L138.713 12.248L126.768 0.283997Z" fill="currentColor" className="ko:text-logo-slash" />
      <path
        d="M207.144 0.000134698L219.089 11.9641L199.093 31.9906L219.089 52.0171L207.143 63.981L187.148 43.9544L167.152 63.9809L155.207 52.0169L175.202 31.9905L155.207 11.9639L167.152 1.38557e-05L187.148 20.0267L207.144 0.000134698Z"
        fill="currentColor"
        className="ko:text-logo-cross"
      />
      <path
        d="M255.196 9.84723C255.196 15.1288 250.921 19.4104 245.647 19.4104C240.374 19.4104 236.099 15.1288 236.099 9.84723C236.099 4.56561 240.374 0.28401 245.647 0.28401C250.921 0.28401 255.196 4.56561 255.196 9.84723Z"
        fill="currentColor"
        className="ko:text-logo-percent-numerator"
      />
      <path d="M288.036 0.28401L236.099 52.3007L248.044 64.2647L299.981 12.248L288.036 0.28401Z" fill="var(--ko-palette-logo-percent-slash)" />
      <path
        d="M300 54.4368C300 59.7184 295.725 64 290.452 64C285.178 64 280.903 59.7184 280.903 54.4368C280.903 49.1552 285.178 44.8736 290.452 44.8736C295.725 44.8736 300 49.1552 300 54.4368Z"
        fill="currentColor"
        className="ko:text-logo-percent-denominator"
      />
    </svg>
  );
}
