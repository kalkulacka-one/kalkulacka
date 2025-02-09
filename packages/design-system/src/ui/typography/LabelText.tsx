type Props = {
  children: React.ReactNode;
};

export function LabelText({ children }: Props) {
  return (
    <span className="k1-font-primary k1-text-xs k1-font-bold k1-uppercase k1-tracking-wider">
      {children}
    </span>
  );
}
