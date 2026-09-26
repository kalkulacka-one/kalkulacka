import type { Icon } from "@kalkulacka-one/design-system/client";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Input as InputHeadless, type InputProps as InputPropsHeadless } from "@headlessui/react";
import { mdiClose } from "@mdi/js";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon as IconComponent } from "./icon";

export type Input = {
  children?: React.ReactElement<React.ComponentProps<typeof Icon>>;
  onClear?: () => void;
  clearLabel?: string;
} & InputPropsHeadless &
  VariantProps<typeof InputVariants>;

const InputVariants = cva(
  [
    "ko:h-12 ko:w-full",
    "ko:bg-surface ko:text-text",
    "ko:border ko:border-border ko:rounded-control",
    "ko:placeholder:text-base ko:placeholder:font-sans ko:placeholder:text-text-muted",
    "ko:transition-[border-color] ko:duration-base",
    "ko:data-hover:border-border-strong",
    "ko:data-focus:border-border-strong ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
    "ko:data-disabled:cursor-not-allowed ko:data-disabled:opacity-45",
    "ko:[&::-webkit-search-cancel-button]:hidden",
  ],
  {
    variants: {
      variant: {
        default: "ko:px-4",
        icon: "ko:px-4 ko:pl-14",
      },
      clearable: {
        true: "ko:pr-14",
        false: "",
      },
    },
  },
);

function InputComponent({ children, variant, onClear, clearLabel, ...props }: Input, ref: React.Ref<HTMLInputElement>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasIcon = children != null;
  const clearable = onClear !== undefined && typeof props.value === "string" && props.value !== "";

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className="ko:relative">
      {hasIcon && <div className="ko:absolute ko:left-4 ko:top-1/2 ko:-translate-y-1/2 ko:text-text-muted">{children}</div>}
      <InputHeadless {...props} ref={setRefs} className={twMerge(InputVariants({ variant: hasIcon ? "icon" : "default", clearable }))} />
      {clearable && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={clearLabel}
          className="ko:absolute ko:right-4 ko:top-1/2 ko:-translate-y-1/2 ko:flex ko:items-center ko:justify-center ko:rounded-pill ko:p-1 ko:text-text-muted ko:hover:bg-neutral-wash ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55"
        >
          <IconComponent icon={mdiClose} decorative size="small" />
        </button>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, Input>(InputComponent);
