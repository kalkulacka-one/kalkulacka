import { cva, VariantProps } from "class-variance-authority";

const circleBadgeStyles = cva(
  "flex size-[4.5rem] items-center justify-center rounded-full p-2",
  {
    variants: {
      color: {
        primary: "bg-primary text-neutral-strong",
        black: "bg-black text-white",
      },
      fontSize: {
        xs: "text-xs",
        sm: "text-sm",
      },
    },
  },
);

type CircleBadgeProps = {
  children: React.ReactNode;
} & VariantProps<typeof circleBadgeStyles>;

export default function CircleBadge({
  children,
  color,
  fontSize,
}: CircleBadgeProps) {
  return (
    <div className={circleBadgeStyles({ color, fontSize })}>
      <p className="text-center leading-[1.23]">
        <strong>{children}</strong>
      </p>
    </div>
  );
}
