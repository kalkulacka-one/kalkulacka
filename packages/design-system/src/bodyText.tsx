export interface bodyTextProps {
  tag?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size: "extra-small" | "small" | "medium" | "large";
  color?: string;
  children?: React.ReactNode;
}

const BodyText = ({ tag: Tag = "p", size, children }: bodyTextProps) => {
  return <Tag className={size}>{children}</Tag>;
};

export default BodyText;
