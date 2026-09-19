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
    "ko:w-full",
    "ko:border ko:border-neutral",
    "ko:rounded-2xl ko:rounded-br-none",
    "ko:placeholder:text-base ko:placeholder:font-sans ko:placeholder:text-neutral",
    "ko:data-hover:border-neutral-hover",
    "ko:data-disabled:placeholder:text-neutral-disabled ko:data-disabled:border-neutral-disabled ko:data-disabled:text-neutral-disabled",
    "ko:[&::-webkit-search-cancel-button]:hidden",
  ],
  {
    variants: {
      variant: {
        default: "ko:p-4",
        icon: "ko:p-4 ko:pl-14",
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
      {hasIcon && <div className="ko:absolute ko:left-4 ko:top-1/2 ko:-translate-y-1/2">{children}</div>}
      <InputHeadless {...props} ref={setRefs} className={twMerge(InputVariants({ variant: hasIcon ? "icon" : "default", clearable }))} />
      {clearable && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={clearLabel}
          className="ko:absolute ko:right-4 ko:top-1/2 ko:-translate-y-1/2 ko:flex ko:items-center ko:justify-center ko:rounded-full ko:p-1 ko:text-neutral ko:hover:bg-neutral/8 ko:focus-visible:outline-2 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-primary"
        >
          <IconComponent icon={mdiClose} decorative size="small" />
        </button>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, Input>(InputComponent);
