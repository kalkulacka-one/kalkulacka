type LogoTextProps = {
  children: React.ReactNode;
};

export function LogoText({ children }: LogoTextProps) {
  return <div className="ko:font-bold ko:font-display ko:text-[0.812rem] ko:uppercase">{children}</div>;
}
