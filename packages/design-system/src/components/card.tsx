type CardVariant = "primary" | "secondary" | "neutral";

interface CardProps {
  variant?: CardVariant;
  children?: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  primary: "ko:bg-primary",
  secondary: "ko:bg-secondary",
  neutral: "ko:bg-neutral",
};

export function Card({ variant = "primary", children }: CardProps) {
  return (
    <div
      className={[
        "ko:w-32 ko:h-32 ko:padding-4 ko:rounded",
        variantClasses[variant],
      ].join(" ")}
    >
      {children}
    </div>
  );
}
