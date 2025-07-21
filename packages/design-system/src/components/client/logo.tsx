import { LogoSvg } from "@repo/design-system/svg";
import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { useId } from "react";

export type Logo = {
  title: string;
  text?: boolean;
} & VariantProps<typeof LogoVariants>;

const LogoVariants = cva(
  ["ko:flex ko:items-center ko:gap-[1.78125rem]", "ko:[&_div]:font-display ko:[&_div]:font-bold ko:[&_div]:uppercase ko:[&_div]:tracking-[10%] ko:[&_div]:leading-[normal] ko:[&_div]:text-nowrap"],
  {
    variants: {
      size: {
        small: ["ko:[&_svg]:w-[5.953rem] ko:[&_svg]:h-5", "ko:[&_div]:text-xs"],
        default: ["ko:[&_svg]:h-[4rem]", "ko:[&_div]:text-[2.25rem]"],
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export function Logo({ title, text, size }: Logo) {
  const titleId = useId();

  return (
    <div className={twMerge(LogoVariants({ size }))}>
      <LogoSvg titleId={titleId} title={title} text={text} className={twMerge("ko:shrink-0")} />
      {text && <div>{title}</div>}
    </div>
  );
}
