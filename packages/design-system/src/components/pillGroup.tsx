type Props = {
  children: React.ReactNode;
};
export function PillGroup({ children }: Props) {
  return <div className="ko:flex ko:gap-2">{children}</div>;
}
