import { LogoSvg } from "@repo/design-system/svg";
import { twMerge } from "@repo/design-system/utils";
import { cva } from "class-variance-authority";

export type Logo = {
  logoName: string;
  children?: React.ReactNode;
  textPosition?: "horizontal" | "vertical";
};

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

export function Logo({ children, logoName, textPosition }: Logo) {
  const hasVisibleText = children != null;
  return (
    <div className={twMerge(LogoVariants({ textPosition }))}>
      <LogoSvg
        aria-label={!hasVisibleText ? logoName : undefined}
        title={!hasVisibleText ? logoName : undefined}
        decorative={hasVisibleText}
        titleId={`${logoName.toLowerCase().split(" ").join("")}-logo`}
        className="ko:w-24 ko:min-w-24"
      />
      <div className="ko:hidden ko:sm:block ko:[line-break:normal] ko:font-bold ko:font-display ko:text-xs ko:uppercase">{children}</div>
    </div>
  );
}
