import { twMerge } from "@kalkulacka-one/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";

export type Logo = {
  title: string;
  text?: boolean;
  monochrome?: boolean;
} & VariantProps<typeof LogoVariants>;

const LogoVariants = cva("ko:flex ko:items-center ko:gap-[1.78125em]", {
  variants: {
    size: {
      small: "ko:text-[0.25rem]",
      medium: "ko:text-[0.375rem]",
      large: "ko:text-[0.5rem]",
      default: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export function Logo({ title, text, monochrome, size }: Logo) {
  const titleId = useId();

  return (
    <div className={twMerge(LogoVariants({ size }))}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={text ? "true" : undefined}
        aria-labelledby={!text ? titleId : undefined}
        focusable="false"
        role={text ? undefined : "img"}
        className="ko:h-[4em] ko:shrink-0"
        viewBox="0 0 300 64"
      >
        {!text && <title id={titleId}>{title}</title>}
        <path
          fill="currentColor"
          className={monochrome ? "" : "ko:text-logo-check"}
          d="M65.9601 1.38557e-05L77.9054 11.964L37.9138 52.0168L25.9684 63.9807L0 37.9722L11.9454 26.0083L25.9684 40.053L65.9601 1.38557e-05Z"
        />
        <path fill="currentColor" className={monochrome ? "" : "ko:text-logo-slash"} d="M126.768 0L74.8308 52.0167L86.7762 63.9807L138.713 11.964L126.768 0Z" />
        <path
          fill="currentColor"
          className={monochrome ? "" : "ko:text-logo-cross"}
          d="M207.144 0.000134698L219.089 11.9641L199.093 31.9906L219.089 52.0171L207.143 63.981L187.148 43.9544L167.152 63.9809L155.207 52.0169L175.202 31.9905L155.207 11.9639L167.152 1.38557e-05L187.148 20.0267L207.144 0.000134698Z"
        />
        <path
          fill="currentColor"
          className={monochrome ? "" : "ko:text-logo-percent-numerator"}
          d="M255.196 9.56323C255.196 14.8449 250.921 19.1265 245.647 19.1265C240.374 19.1265 236.099 14.8449 236.099 9.56323C236.099 4.28161 240.374 1.38557e-05 245.647 1.38557e-05C250.921 1.38557e-05 255.196 4.28161 255.196 9.56323Z"
        />
        <path fill="currentColor" className={monochrome ? "" : "ko:text-logo-percent-slash"} d="M288.036 1.38557e-05L236.099 52.0167L248.044 63.9807L299.981 11.964L288.036 1.38557e-05Z" />
        <path
          fill="currentColor"
          className={monochrome ? "" : "ko:text-logo-percent-denominator"}
          d="M300 54.4368C300 59.7184 295.725 64 290.452 64C285.178 64 280.903 59.7184 280.903 54.4368C280.903 49.1552 285.178 44.8736 290.452 44.8736C295.725 44.8736 300 49.1552 300 54.4368Z"
        />
      </svg>
      {text && <div className="ko:font-display ko:font-bold ko:uppercase ko:text-[2.25em] ko:tracking-[10%] ko:leading-[normal] ko:text-nowrap">{title}</div>}
    </div>
  );
}
