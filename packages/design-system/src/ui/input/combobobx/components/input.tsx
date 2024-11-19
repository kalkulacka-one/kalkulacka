import {
  ComboboxInput as InputPrimitive,
  ComboboxInputProps as InputPrimitiveProps,
} from "@headlessui/react";
import { forwardRef, useRef, useImperativeHandle } from "react";
import { twMerge } from "tailwind-merge";

const Input = forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputPrimitiveProps & { className?: string } // InputProps has more variable className, but we need string
>(({ className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <InputPrimitive
      ref={inputRef}
      className={twMerge("k1-w-full", className)}
      {...props}
    />
  );
});
Input.displayName = InputPrimitive.displayName;

export { Input };
