import { LogoSvg } from "@repo/design-system/svg";
import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";

export type Logo = {
  text?: boolean;
  children: string;
} & VariantProps<typeof LogoVariants>;

const LogoVariants = cva("ko:flex ko:gap-2", {
  variants: {
    textPosition: {
      horizontal: "ko:items-center",
      vertical: "ko:flex-col",
    },
  },
  defaultVariants: {
    textPosition: "horizontal",
  },
});

export function Logo({ children, text = false, textPosition }: Logo) {
  return (
    <div className={twMerge(LogoVariants({ textPosition }))}>
      <LogoSvg aria-label={!text ? children : undefined} decorative={text} title={!text ? children : undefined} titleId={`${children}-logo`} className="ko:w-24 ko:min-w-24" />
      {text && <div className="ko:hidden ko:sm:block ko:[line-break:normal] ko:font-bold ko:font-display ko:text-[0.812rem] ko:uppercase">{children}</div>}
    </div>
  );
}
